import "server-only"
import { ObjectId } from "mongodb"
import { getVisitorId } from "@backend/metrics/utils"
import { blogService } from "@backend/blog/services"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import {
  blogCategorySchema,
  blogImagePurposeSchema,
  blogPostSchema,
} from "./schemas"

const admin = async (permission: "blog.read" | "blog.manage") => {
  const session = await getVerifiedAdminSession()
  return !session
    ? 401
    : session.permissions.includes(permission)
      ? session
      : 403
}

export const blogController = {
  async recordView(request: Request, slug: string) {
    const recorded = await blogService.recordView(slug, getVisitorId(request))
    return recorded ? Response.json({ status: "recorded" }, { status: 202, headers: { "Cache-Control": "no-store" } }) : Response.json({ error: "Not found" }, { status: 404 })
  },
  async toggleLike(request: Request, slug: string) {
    const result = await blogService.toggleLike(slug, getVisitorId(request))
    return result ? Response.json(result, { headers: { "Cache-Control": "no-store" } }) : Response.json({ error: "Not found" }, { status: 404 })
  },
  async listAdmin() {
    const session = await admin("blog.read")
    if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session })

    return Response.json({
      posts: (await blogService.adminPosts()).map((post) => ({
        ...post,
        _id: String(post._id),
        categoryId: String(post.categoryId),
        coverMediaId: post.coverMediaId?.toHexString(),
        mediaIds: post.mediaIds?.map(String),
      })),
      categories: (await blogService.categories()).map((category) => ({
        ...category,
        _id: String(category._id),
      })),
    })
  },
  async savePost(request: Request, id?: string) {
    const session = await admin("blog.manage")
    if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session })

    const parsed = blogPostSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid post" }, { status: 400 })

    const saved = await blogService.savePost(id, session.userId, {
      ...parsed.data,
      categoryId: new ObjectId(parsed.data.categoryId),
    })

    return saved
      ? Response.json({ id: String(saved) })
      : Response.json({ error: "Not found" }, { status: 404 })
  },
  async saveCategory(request: Request, id?: string) {
    const session = await admin("blog.manage")
    if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session })

    const parsed = blogCategorySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid category" }, { status: 400 })

    return Response.json({ id: String(await blogService.saveCategory(id, parsed.data)) })
  },
  async removePost(id: string) { const session = await admin("blog.manage"); if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session }); return (await blogService.deletePost(id, session.userId)) ? new Response(null, { status: 204 }) : Response.json({ error: "Not found" }, { status: 404 }) },
  async removeCategory(id: string) { const session = await admin("blog.manage"); if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session }); const removed = await blogService.deleteCategory(id); return removed === null ? Response.json({ error: "Category has posts" }, { status: 409 }) : removed ? new Response(null, { status: 204 }) : Response.json({ error: "Not found" }, { status: 404 }) },
  async uploadImage(request: Request) {
    const session = await admin("blog.manage")
    if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session })

    const form = await request.formData().catch(() => null)
    const postId = form?.get("postId")
    const image = form?.get("image")
    const purpose = blogImagePurposeSchema.safeParse(form?.get("purpose") ?? "content")
    if (
      typeof postId !== "string"
      || !(image instanceof File)
      || image.size === 0
      || image.size > 5 * 1024 * 1024
      || !purpose.success
    ) {
      return Response.json({ error: "Invalid image" }, { status: 400 })
    }

    try {
      const media = await blogService.attachImage(
        postId,
        session.userId,
        Buffer.from(await image.arrayBuffer()),
        purpose.data,
      )

      return media
        ? Response.json(media)
        : Response.json({ error: "Not found" }, { status: 404 })
    } catch {
      return Response.json({ error: "Image unavailable" }, { status: 503 })
    }
  },
  async removeImage(postId: string, mediaId: string) { const session = await admin("blog.manage"); if (typeof session === "number") return Response.json({ error: "Forbidden" }, { status: session }); return (await blogService.removeImage(postId, mediaId, session.userId)) ? new Response(null, { status: 204 }) : Response.json({ error: "Not found" }, { status: 404 }) },
}
