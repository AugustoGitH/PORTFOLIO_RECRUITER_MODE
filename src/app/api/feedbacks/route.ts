import { feedbackController } from "@backend/feedback"
import { withPublicControllerSecurity, withRateLimit } from "@backend/security"

export const runtime = "nodejs"

export const GET = feedbackController.listPublished
export const POST = withRateLimit(
  (request) => withPublicControllerSecurity(feedbackController.submit)(request),
  { visitor: 5, ip: 15 },
  "feedback-submit",
)
