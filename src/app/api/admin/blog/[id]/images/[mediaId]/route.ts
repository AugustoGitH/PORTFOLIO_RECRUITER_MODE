import { blogController } from "@backend/blog"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const DELETE = (request: Request, context: { params: Promise<{ id: string; mediaId: string }> }) =>
  context.params.then(({ id, mediaId }) => requireSameOrigin(request) ?? blogController.removeImage(id, mediaId))
