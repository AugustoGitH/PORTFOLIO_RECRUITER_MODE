import { portfolioFeedbackController } from "@backend/portfolio-feedbacks"

export const runtime = "nodejs"

export const PATCH = (
  request: Request,
  context: { params: Promise<{ id: string }> },
) => context.params.then(({ id }) => portfolioFeedbackController.moderate(request, id))
