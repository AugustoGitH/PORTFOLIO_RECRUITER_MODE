import type { AdminPortfolioFeedback } from "./components/AdminPortfolioFeedbacksSection"

export type AdminPortfolioFeedbacksPageProps = {
  feedbacks: AdminPortfolioFeedback[]
  nextCursor?: string
  canModerate: boolean
}
