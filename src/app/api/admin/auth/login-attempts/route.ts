import { adminAuthController } from "@backend/admin/controllers"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const GET = adminAuthController.listLoginAttempts
export const DELETE = (request: Request) => (
  requireSameOrigin(request) ?? adminAuthController.resetLoginAttempts(request)
)
