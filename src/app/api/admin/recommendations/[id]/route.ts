import { recommendationController } from "@backend/developer-recommendations"
export const runtime = "nodejs"
export const PATCH = (request: Request, context: { params: Promise<{ id: string }> }) => context.params.then(({ id }) => recommendationController.save(request, id))
