import "server-only"
import { ObjectId } from "mongodb"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { blogRepository } from "@backend/blog/repositories"
import { deletePublicObject, putPublicWebp } from "@backend/media/storage"
import type { BlogPost, BlogPostStatus } from "@backend/blog/models"

const publishedTag = "blog:published"
type CachedPublishedPost = Omit<BlogPost, "_id" | "categoryId" | "coverMediaId" | "mediaIds" | "createdBy" | "updatedBy"> & {
  _id: string
  categoryId: string
  coverMediaId?: string
  mediaIds?: string[]
  createdBy: string
  updatedBy: string
}

type PublicCover = {
  url: string
  width: number
  height: number
}

const toCachedPublishedPost = (post: BlogPost): CachedPublishedPost => ({
  ...post,
  _id: post._id.toHexString(),
  categoryId: post.categoryId.toHexString(),
  coverMediaId: post.coverMediaId?.toHexString(),
  mediaIds: post.mediaIds?.map((id) => id.toHexString()),
  createdBy: post.createdBy.toHexString(),
  updatedBy: post.updatedBy.toHexString(),
})

const published = unstable_cache(
  async () => (await blogRepository.listPosts("published")).map(toCachedPublishedPost),
  [publishedTag, "v3"],
  { revalidate: 300, tags: [publishedTag] },
)

const toPublicPost = (
  post: Pick<BlogPost, "slug" | "title" | "subtitle" | "excerpt" | "markdown" | "publishedAt"> & {
    categoryId: string | BlogPost["categoryId"]
  },
  totals: { views: number; likes: number } = { views: 0, likes: 0 },
  cover?: PublicCover,
) => ({
  slug: post.slug,
  title: post.title,
  subtitle: post.subtitle,
  excerpt: post.excerpt,
  markdown: post.markdown,
  publishedAt: post.publishedAt,
  categoryId: String(post.categoryId),
  cover,
  ...totals,
})

const toPublicCover = (media: Awaited<ReturnType<typeof blogRepository.findMedia>>): PublicCover | undefined =>
  media
    ? { url: media.publicUrl, width: media.width, height: media.height }
    : undefined

const revalidatePublicPost = (slug: string) => {
  revalidateTag(publishedTag, { expire: 0 })
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
}

const rankedPublished = unstable_cache(async () => {
  const posts = await published()
  const [totals, coverMedia] = await Promise.all([
    blogRepository.getTotals(posts.map((post) => new ObjectId(post._id))),
    blogRepository.findMediaByIds(
      posts.flatMap((post) => post.coverMediaId ? [new ObjectId(post.coverMediaId)] : []),
    ),
  ])
  const coverById = new Map(coverMedia.map((media) => [media._id.toHexString(), toPublicCover(media)]))

  return posts
    .map((post) => toPublicPost(
      post,
      totals.get(post._id),
      post.coverMediaId ? coverById.get(post.coverMediaId) : undefined,
    ))
    .sort((first, second) =>
      second.likes - first.likes ||
      second.views - first.views ||
      String(second.publishedAt).localeCompare(String(first.publishedAt)),
    )
}, [publishedTag, "ranked", "v3"], { revalidate: 60, tags: [publishedTag] })

export const blogService = {
  categories: () => blogRepository.listCategories(),
  posts: (status?: BlogPostStatus) => blogRepository.listPosts(status),

  async adminPosts() {
    const posts = await blogRepository.listPosts()
    const media = await blogRepository.findMediaByIds(
      posts.flatMap((post) => [
        ...(post.coverMediaId ? [post.coverMediaId] : []),
        ...(post.mediaIds ?? []),
      ]),
    )
    const mediaById = new Map(media.map((item) => [item._id.toHexString(), item]))

    return posts.map((post) => {
      const cover = post.coverMediaId
        ? mediaById.get(post.coverMediaId.toHexString())
        : undefined

      return {
        ...post,
        cover: cover
          ? {
              id: cover._id.toHexString(),
              publicUrl: cover.publicUrl,
              width: cover.width,
              height: cover.height,
            }
          : undefined,
        media: (post.mediaIds ?? [])
          .map((id) => mediaById.get(id.toHexString()))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .map((item) => ({ id: item._id.toHexString(), publicUrl: item.publicUrl })),
      }
    })
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

    const [totals, cover] = await Promise.all([
      blogRepository.getTotals([new ObjectId(post._id)]),
      post.coverMediaId
        ? blogRepository.findMedia(new ObjectId(post.coverMediaId))
        : Promise.resolve(null),
    ])

    return toPublicPost(post, totals.get(post._id), toPublicCover(cover))
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

    const mediaIds = new Map([
      ...(current?.coverMediaId ? [current.coverMediaId] : []),
      ...(current?.mediaIds ?? []),
    ].map((mediaId) => [mediaId.toHexString(), mediaId])).values()

    for (const mediaId of mediaIds) {
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

  async attachImage(id: string, actorId: string, source: Buffer, purpose: "content" | "cover" = "content") {
    const post = await blogRepository.findPost(id)
    if (!post || !ObjectId.isValid(actorId)) return null
    const image = sharp(source, { failOn: "error" })
    const metadata = await image.metadata()
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) throw new Error("Unsupported image format")
    const output = await image.rotate().resize(1920, 1920, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true })
    const stored = await putPublicWebp(`blog/${id}/${randomUUID()}.webp`, output.data)
    const actorObjectId = new ObjectId(actorId)
    let mediaId: ObjectId | undefined
    let isAttached = false

    try {
      mediaId = await blogRepository.createMedia({
        provider: "r2",
        ...stored,
        contentType: "image/webp",
        width: output.info.width,
        height: output.info.height,
        bytes: output.info.size,
        createdBy: actorObjectId,
      })

      const coverReplacement = purpose === "cover"
        ? await blogRepository.replaceCoverMedia(id, mediaId, actorObjectId)
        : undefined
      const attached = purpose === "cover"
        ? Boolean(coverReplacement)
        : await blogRepository.addPostMedia(id, mediaId, actorObjectId)

      if (!attached) throw new Error("Post unavailable")
      isAttached = true

      if (coverReplacement?.previousCoverMediaId) {
        const previous = await blogRepository.findMedia(coverReplacement.previousCoverMediaId)
        if (previous) {
          try {
            await deletePublicObject(previous.key)
            await blogRepository.markMediaDeleted(previous._id)
          } catch {
            // The new cover is already active. A stale asset can be retried by maintenance.
          }
        }
      }

      await blogRepository.audit({
        postId: post._id,
        actorId: actorObjectId,
        action: purpose === "cover" ? "cover_updated" : "image_attached",
        at: new Date(),
      })

      if (purpose === "cover") revalidatePublicPost(post.slug)

      return {
        mediaId: mediaId.toHexString(),
        publicUrl: stored.publicUrl,
        width: output.info.width,
        height: output.info.height,
      }
    } catch (error) {
      if (!isAttached) {
        await deletePublicObject(stored.key).catch(() => undefined)
        if (mediaId) await blogRepository.markMediaDeleted(mediaId).catch(() => undefined)
      }
      throw error
    }
  },

  async removeImage(id: string, mediaId: string, actorId: string) {
    const post = await blogRepository.findPost(id)
    if (!post || !ObjectId.isValid(mediaId) || !ObjectId.isValid(actorId)) return false

    const objectId = new ObjectId(mediaId)
    const isCover = post.coverMediaId?.equals(objectId) ?? false
    const isContentImage = (post.mediaIds ?? []).some((item) => item.equals(objectId))
    if (!isCover && !isContentImage) return false

    const media = await blogRepository.findMedia(objectId)
    if (!media) return false

    const actorObjectId = new ObjectId(actorId)
    const detached = await blogRepository.detachMedia(id, objectId, actorObjectId, isCover)
    if (!detached) return false

    await deletePublicObject(media.key)
    await blogRepository.markMediaDeleted(media._id)
    await blogRepository.audit({
      postId: post._id,
      actorId: actorObjectId,
      action: isCover ? "cover_removed" : "updated",
      at: new Date(),
    })
    revalidatePublicPost(post.slug)

    return true
  },
}
