import { recommendationController } from "@backend/developer-recommendations"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const POST = (request: Request) => requireSameOrigin(request) ?? recommendationController.uploadAvatar(request)
export const DELETE = (request: Request) => requireSameOrigin(request) ?? recommendationController.removeAvatar(request)
