export type PortfolioFeedbackCategory =
  | "navigation"
  | "content"
  | "recruiter"
  | "design"
  | "general"

export type PublicPortfolioFeedback = {
  id: string
  message: string
  category: PortfolioFeedbackCategory
}
