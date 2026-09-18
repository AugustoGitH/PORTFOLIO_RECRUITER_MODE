import { portfolioFeedbackController } from "@backend/portfolio-feedbacks"
import { withIdempotency, withPublicControllerSecurity, withRateLimit } from "@backend/security"

export const runtime = "nodejs"

export const POST = withIdempotency(withRateLimit(
  (request) => {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ error: "Invalid request" }, { status: 415 })
    }

    return withPublicControllerSecurity(portfolioFeedbackController.submit)(request)
  },
  { visitor: 3, ip: 10 },
  "portfolio-feedback-submit",
  15 * 60_000,
), "portfolio-feedback-submit")
