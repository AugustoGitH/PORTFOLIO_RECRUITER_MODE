import "server-only"
import { z } from "zod"
import { getVisitorId } from "@backend/metrics/utils"
import { portfolioFeedbackService } from "@backend/portfolio-feedbacks/services"

const schema = z.object({ message: z.string().trim().min(1).max(1000) }).strict()

export const portfolioFeedbackController = {
  async submit(request: Request) {
    const parsed = schema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid feedback submission" }, { status: 400, headers: { "Cache-Control": "no-store" } })

    try {
      const visitorId = getVisitorId(request)
      await portfolioFeedbackService.submit(parsed.data.message, visitorId)

      const response = Response.json({ status: "received" }, { status: 202, headers: { "Cache-Control": "no-store" } })
      if (!request.headers.get("cookie")?.includes("visitor_id=")) {
        response.headers.set("Set-Cookie", `visitor_id=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
      }

      return response
    } catch {
      return Response.json({ error: "Feedback unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } })
    }
  },
}
