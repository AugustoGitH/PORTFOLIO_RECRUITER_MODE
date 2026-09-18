import { feedbackController } from "@backend/feedback"

export const runtime = "nodejs"
export const PATCH = (request: Request, context: { params: Promise<{ id: string }> }) => context.params.then(({ id }) => feedbackController.moderate(request, id))
export const DELETE = (request: Request, context: { params: Promise<{ id: string }> }) => context.params.then(({ id }) => feedbackController.remove(request, id))
