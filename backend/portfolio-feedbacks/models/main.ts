import "server-only"
import type { Collection, Db } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"

export const PORTFOLIO_FEEDBACK_CATEGORIES = [
  "navigation",
  "content",
  "recruiter",
  "design",
  "general",
] as const

export type PortfolioFeedbackCategory = typeof PORTFOLIO_FEEDBACK_CATEGORIES[number]
export type PortfolioFeedbackStatus = "pending" | "published"

export type PortfolioFeedback = MongoDocument & {
  message: string
  visitorId: string
  submittedAt: Date
  publicationConsent?: boolean
  status?: PortfolioFeedbackStatus
  category?: PortfolioFeedbackCategory
  publishedAt?: Date
}

export const getPortfolioFeedbacksCollection = (db: Db): Collection<PortfolioFeedback> =>
  db.collection("portfolio_feedbacks")
