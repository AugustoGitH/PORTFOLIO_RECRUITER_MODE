import { blogController } from "@backend/blog"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const PATCH = (request: Request, context: { params: Promise<{ id: string }> }) =>
  context.params.then(({ id }) => requireSameOrigin(request) ?? blogController.saveCategory(request, id))

export const DELETE = (request: Request, context: { params: Promise<{ id: string }> }) =>
  context.params.then(({ id }) => requireSameOrigin(request) ?? blogController.removeCategory(id))
