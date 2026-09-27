export type AdminPortfolioFeedback = {
  id: string
  message: string
  visitorId: string
  submittedAt: string
}

export type AdminPortfolioFeedbacksSectionProps = {
  feedbacks: AdminPortfolioFeedback[]
  nextCursor?: string
}
