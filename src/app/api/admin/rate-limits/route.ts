import { publicRateLimitAdminController } from "@backend/security/rate-limit/admin"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const GET = publicRateLimitAdminController.list
export const DELETE = (request: Request) => (
  requireSameOrigin(request) ?? publicRateLimitAdminController.reset(request)
)
