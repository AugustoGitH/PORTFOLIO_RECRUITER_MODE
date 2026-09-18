import "server-only"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { getVisitorId } from "@backend/metrics/utils"
import { feedbackService, FeedbackError } from "@backend/feedback/services"
import { feedbackModerationSchema, feedbackStatusSchema, feedbackSubmissionSchema } from "./schemas"

const noStore = { "Cache-Control": "no-store" }

export const feedbackController = {
  async submit(request: Request) {
    const parsed = feedbackSubmissionSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid feedback submission" }, { status: 400, headers: noStore })
    try {
      const visitorId = getVisitorId(request)
      await feedbackService.submit({ ...parsed.data, visitorId, linkedinUrl: parsed.data.linkedinUrl || undefined })
      const response = Response.json({ status: "received" }, { status: 202, headers: noStore })
      if (!request.headers.get("cookie")?.includes("visitor_id=")) response.headers.set("Set-Cookie", `visitor_id=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
      return response
    } catch (error) {
      if (error instanceof FeedbackError) return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      console.error("Unable to submit feedback", error)
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: noStore })
    }
  },
  async listPublished() {
    return Response.json(await feedbackService.getPublished(), { headers: { "Cache-Control": "public, max-age=300" } })
  },
  async listForModeration(request: Request) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.read")) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    const requestedStatus = new URL(request.url).searchParams.get("status")
    const feedbacks = requestedStatus ? await feedbackService.listForModeration(feedbackStatusSchema.parse(requestedStatus)) : await feedbackService.listAllForModeration()
    return Response.json(await Promise.all(feedbacks.map(async (feedback) => ({ id: String(feedback._id), message: feedback.message, linkedinUrl: feedback.linkedinUrl, submittedAt: feedback.submittedAt.toISOString(), status: feedback.status, editorial: feedback.editorial, avatarUrl: await feedbackService.getAvatarUrl(feedback.editorial?.profileImageId), companyImageUrl: await feedbackService.getAvatarUrl(feedback.editorial?.companyImageId) }))), { headers: noStore })
  },
  async moderate(request: Request, id: string) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.moderate")) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    const parsed = feedbackModerationSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid moderation request" }, { status: 400, headers: noStore })
    try {
      const feedback = await feedbackService.moderate(id, session.userId, parsed.data)
      return Response.json(feedback, { headers: noStore })
    } catch (error) {
      if (error instanceof FeedbackError) return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      console.error("Unable to moderate feedback", error)
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: noStore })
    }
  },
  async remove(request: Request, id: string) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.moderate")) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    try {
      await feedbackService.remove(id, session.userId)
      return new Response(null, { status: 204, headers: noStore })
    } catch (error) {
      if (error instanceof FeedbackError) return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: noStore })
    }
  },
  async uploadAvatar(request: Request) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.moderate")) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    const form = await request.formData().catch(() => null)
    const feedbackId = form?.get("feedbackId")
    const avatar = form?.get("avatar")
    const kind = form?.get("kind")
    if (typeof feedbackId !== "string" || (kind !== "profile" && kind !== "company") || !(avatar instanceof File) || avatar.size === 0 || avatar.size > 5 * 1024 * 1024) return Response.json({ error: "Invalid avatar upload" }, { status: 400, headers: noStore })
    try {
      const publicUrl = await feedbackService.attachAvatar(feedbackId, session.userId, Buffer.from(await avatar.arrayBuffer()), kind)
      return Response.json({ publicUrl }, { headers: noStore })
    } catch (error) {
      if (error instanceof FeedbackError) return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      console.error("Unable to upload feedback avatar", error)
      return Response.json({ error: "Avatar unavailable" }, { status: 503, headers: noStore })
    }
  },
  async removeAvatar(request: Request) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.moderate")) return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    const body = await request.json().catch(() => null)
    const feedbackId = body?.feedbackId
    const kind = body?.kind
    if (typeof feedbackId !== "string" || (kind !== "profile" && kind !== "company")) return Response.json({ error: "Invalid avatar removal" }, { status: 400, headers: noStore })
    try {
      await feedbackService.removeAvatar(feedbackId, session.userId, kind)
      return new Response(null, { status: 204, headers: noStore })
    } catch (error) {
      if (error instanceof FeedbackError) return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      return Response.json({ error: "Avatar unavailable" }, { status: 503, headers: noStore })
    }
  },
}
