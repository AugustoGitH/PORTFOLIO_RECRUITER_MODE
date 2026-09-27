import { metricsController } from "@backend/metrics"
import { withPublicControllerSecurity, withRateLimit } from "@backend/security"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return metricsController.getPortfolioViews()
}

export const POST = withRateLimit(
  (request) => withPublicControllerSecurity(metricsController.registerPortfolioView)(request),
  { visitor: 5, ip: 30 },
  "portfolio-view",
)
