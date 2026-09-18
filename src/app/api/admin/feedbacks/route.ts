import { feedbackController } from "@backend/feedback"

export const runtime = "nodejs"
export const GET = feedbackController.listForModeration
