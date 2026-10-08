import { blogController } from "@backend/blog"
import { requireSameOrigin } from "@backend/security"

export const runtime = "nodejs"

export const PATCH = (request: Request, context: RouteContext<"/api/admin/blog/glossary/[id]">) =>
  context.params.then(({ id }) =>
    requireSameOrigin(request) ?? blogController.saveGlossaryEntry(request, id),
  )

export const DELETE = (request: Request, context: RouteContext<"/api/admin/blog/glossary/[id]">) =>
  context.params.then(({ id }) =>
    requireSameOrigin(request) ?? blogController.removeGlossaryEntry(id),
  )
