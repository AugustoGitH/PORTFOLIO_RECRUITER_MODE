import { blogController } from "@backend/blog"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"
export const POST = (request: Request) => requireSameOrigin(request) ?? blogController.uploadImage(request)
