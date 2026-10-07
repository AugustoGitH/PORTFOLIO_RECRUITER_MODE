import "server-only"
import { z } from "zod"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { getVisitorId } from "@backend/metrics/utils"
import { PORTFOLIO_FEEDBACK_CATEGORIES } from "@backend/portfolio-feedbacks/models"
import {
  PortfolioFeedbackError,
  portfolioFeedbackService,
} from "@backend/portfolio-feedbacks/services"

const schema = z.object({
  message: z.string().trim().min(1).max(1000),
  allowPublication: z.boolean().optional().default(false),
}).strict()
const moderationSchema = z.object({
  status: z.enum(["pending", "published"]),
  category: z.enum(PORTFOLIO_FEEDBACK_CATEGORIES),
}).strict()
const noStore = { "Cache-Control": "no-store" }

export const portfolioFeedbackController = {
  async submit(request: Request) {
    const parsed = schema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid feedback submission" }, { status: 400, headers: noStore })

    try {
      const visitorId = getVisitorId(request)
      await portfolioFeedbackService.submit(
        parsed.data.message,
        visitorId,
        parsed.data.allowPublication,
      )

      const response = Response.json({ status: "received" }, { status: 202, headers: noStore })
      if (!request.headers.get("cookie")?.includes("visitor_id=")) {
        response.headers.set("Set-Cookie", `visitor_id=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
      }

      return response
    } catch {
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: noStore })
    }
  },

  async moderate(request: Request, id: string) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore })
    if (!session.permissions.includes("feedback.moderate")) {
      return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore })
    }

    const parsed = moderationSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return Response.json({ error: "Invalid moderation request" }, { status: 400, headers: noStore })
    }

    try {
      const feedback = await portfolioFeedbackService.moderate(id, parsed.data)
      if (!feedback) return Response.json({ error: "Feedback not found" }, { status: 404, headers: noStore })

      return Response.json({
        id: String(feedback._id),
        status: feedback.status ?? "pending",
        category: feedback.category ?? "general",
      }, { headers: noStore })
    } catch (error) {
      if (error instanceof PortfolioFeedbackError) {
        return Response.json({ error: error.message }, { status: error.status, headers: noStore })
      }
      console.error("Unable to moderate portfolio feedback", error)
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: noStore })
    }
  },
}
