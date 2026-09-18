import "server-only"
import type { Collection, Db } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"

export type PortfolioFeedback = MongoDocument & {
  message: string
  visitorId: string
  submittedAt: Date
}

export const getPortfolioFeedbacksCollection = (db: Db): Collection<PortfolioFeedback> =>
  db.collection("portfolio_feedbacks")
