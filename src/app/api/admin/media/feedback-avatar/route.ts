import { feedbackController } from "@backend/feedback"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"
export const POST = (request: Request) => requireSameOrigin(request) ?? feedbackController.uploadAvatar(request)
export const DELETE = (request: Request) => requireSameOrigin(request) ?? feedbackController.removeAvatar(request)
