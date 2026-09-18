import "server-only"
import { ObjectId } from "mongodb"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { blogRepository } from "@backend/blog/repositories"
import { deletePublicObject, putPublicWebp } from "@backend/media/storage"
import type { BlogPost, BlogPostStatus } from "@backend/blog/models"

const publishedTag = "blog:published"
type CachedPublishedPost = Omit<BlogPost, "_id" | "categoryId" | "mediaIds" | "createdBy" | "updatedBy"> & {
  _id: string
  categoryId: string
  mediaIds?: string[]
  createdBy: string
  updatedBy: string
}

const toCachedPublishedPost = (post: BlogPost): CachedPublishedPost => ({
  ...post,
  _id: post._id.toHexString(),
  categoryId: post.categoryId.toHexString(),
  mediaIds: post.mediaIds?.map((id) => id.toHexString()),
  createdBy: post.createdBy.toHexString(),
  updatedBy: post.updatedBy.toHexString(),
})

const published = unstable_cache(
  async () => (await blogRepository.listPosts("published")).map(toCachedPublishedPost),
  [publishedTag, "v2"],
  { revalidate: 300, tags: [publishedTag] },
)

const toPublicPost = (
  post: Pick<BlogPost, "slug" | "title" | "excerpt" | "markdown" | "publishedAt"> & {
    categoryId: string | BlogPost["categoryId"]
  },
  totals: { views: number; likes: number } = { views: 0, likes: 0 },
) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  markdown: post.markdown,
  publishedAt: post.publishedAt,
  categoryId: String(post.categoryId),
  ...totals,
})

const editablePost = (post: BlogPost) => {
  const { _id, createdAt, updatedAt, ...input } = post
  void _id
  void createdAt
  void updatedAt
  return input
}

const rankedPublished = unstable_cache(async () => {
  const posts = await published()
  const totals = await blogRepository.getTotals(posts.map((post) => new ObjectId(post._id)))

  return posts
    .map((post) => toPublicPost(post, totals.get(post._id)))
    .sort((first, second) =>
      second.likes - first.likes ||
      second.views - first.views ||
      String(second.publishedAt).localeCompare(String(first.publishedAt)),
    )
}, [publishedTag, "ranked", "v2"], { revalidate: 60, tags: [publishedTag] })

export const blogService = {
  categories: () => blogRepository.listCategories(),
  posts: (status?: BlogPostStatus) => blogRepository.listPosts(status),

  async adminPosts() {
    return Promise.all((await blogRepository.listPosts()).map(async (post) => ({
      ...post,
      media: (await Promise.all((post.mediaIds ?? []).map((id) => blogRepository.findMedia(id))))
        .filter((media): media is NonNullable<typeof media> => Boolean(media))
        .map((media) => ({ id: String(media._id), publicUrl: media.publicUrl })),
    })))
  },

  saveCategory(id: string | undefined, input: { slug: string; name: string; description?: string }) {
    return blogRepository.saveCategory(id, input)
  },

  deleteCategory: (id: string) => blogRepository.deleteCategory(id),

  async publishedPosts() {
    try {
      return await rankedPublished()
    } catch {
      return []
    }
  },

  async publishedPost(slug: string) {
    const post = (await published()).find((item) => item.slug === slug)
    if (!post) return null

    const totals = await blogRepository.getTotals([new ObjectId(post._id)])
    return toPublicPost(post, totals.get(post._id))
  },

  async recordView(slug: string, visitorId: string) {
    const post = await blogRepository.findPostBySlug(slug)
    if (!post || post.status !== "published") return null

    await blogRepository.recordView(post._id, visitorId)
    return true
  },

  async toggleLike(slug: string, visitorId: string) {
    const post = await blogRepository.findPostBySlug(slug)
    if (!post || post.status !== "published") return null

    const liked = await blogRepository.toggleLike(post._id, visitorId)
    const totals = await blogRepository.getTotals([post._id])
    revalidateTag(publishedTag, { expire: 0 })

    return { liked, ...totals.get(post._id.toHexString())! }
  },

  async savePost(
    id: string | undefined,
    actorId: string,
    input: Omit<BlogPost, "_id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">,
  ) {
    const current = id ? await blogRepository.findPost(id) : null
    const saved = await blogRepository.savePost(id, {
      ...input,
      createdBy: current?.createdBy ?? new ObjectId(actorId),
      updatedBy: new ObjectId(actorId),
    })

    if (saved) await blogRepository.audit({ postId: saved, actorId: new ObjectId(actorId), action: input.status === "published" ? "published" : input.status === "archived" ? "archived" : current ? "updated" : "created", at: new Date() })

    revalidateTag(publishedTag, { expire: 0 })
    revalidatePath("/blog")
    if (current?.slug) revalidatePath(`/blog/${current.slug}`)
    if (input.status === "published") revalidatePath(`/blog/${input.slug}`)

    return saved
  },

  async deletePost(id: string, actorId: string) {
    const current = await blogRepository.findPost(id)
    const removed = await blogRepository.deletePost(id)
    if (!removed) return false

    for (const mediaId of current?.mediaIds ?? []) {
      const media = await blogRepository.findMedia(mediaId)
      if (!media) continue
      await deletePublicObject(media.key)
      await blogRepository.markMediaDeleted(media._id)
    }
    if (current) await blogRepository.audit({ postId: current._id, actorId: new ObjectId(actorId), action: "removed", at: new Date() })

    revalidateTag(publishedTag, { expire: 0 })
    revalidatePath("/blog")
    if (current?.slug) revalidatePath(`/blog/${current.slug}`)

    return true
  },

  async attachImage(id: string, actorId: string, source: Buffer) {
    const post = await blogRepository.findPost(id)
    if (!post || !ObjectId.isValid(actorId)) return null
    const image = sharp(source, { failOn: "error" })
    const metadata = await image.metadata()
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) throw new Error("Unsupported image format")
    const output = await image.rotate().resize(1920, 1920, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true })
    const stored = await putPublicWebp(`blog/${id}/${randomUUID()}.webp`, output.data)
    const mediaId = await blogRepository.createMedia({ provider: "r2", ...stored, contentType: "image/webp", width: output.info.width, height: output.info.height, bytes: output.info.size, createdBy: new ObjectId(actorId) })
    await blogRepository.savePost(id, { ...editablePost(post), mediaIds: [...(post.mediaIds ?? []), mediaId] })
    await blogRepository.audit({ postId: post._id, actorId: new ObjectId(actorId), action: "image_attached", at: new Date() })
    return stored.publicUrl
  },

  async removeImage(id: string, mediaId: string, actorId: string) {
    const post = await blogRepository.findPost(id)
    if (!post || !ObjectId.isValid(mediaId) || !ObjectId.isValid(actorId)) return false

    const objectId = new ObjectId(mediaId)
    if (!(post.mediaIds ?? []).some((item) => item.equals(objectId))) return false

    const media = await blogRepository.findMedia(objectId)
    if (!media) return false

    await deletePublicObject(media.key)
    await blogRepository.markMediaDeleted(media._id)
    await blogRepository.savePost(id, {
      ...editablePost(post),
      mediaIds: post.mediaIds?.filter((item) => !item.equals(objectId)),
    })
    await blogRepository.audit({ postId: post._id, actorId: new ObjectId(actorId), action: "updated", at: new Date() })

    return true
  },
}
