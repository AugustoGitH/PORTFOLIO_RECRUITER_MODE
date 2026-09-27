import { metricsController } from "@backend/metrics"
import { withPublicControllerSecurity, withRateLimit } from "@backend/security"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const POST = withRateLimit(
  (request) => withPublicControllerSecurity(metricsController.toggleLike)(request),
  { visitor: 10, ip: 30 },
  "portfolio-like",
)
