import type { PortfolioFeedbackCategory } from "@/types/service/portfolio-feedback"

export type AdminPortfolioFeedback = {
  id: string
  message: string
  visitorId: string
  submittedAt: string
  publicationConsent: boolean
  status: "pending" | "published"
  category: PortfolioFeedbackCategory
}

export type AdminPortfolioFeedbacksSectionProps = {
  feedbacks: AdminPortfolioFeedback[]
  nextCursor?: string
  canModerate: boolean
}
