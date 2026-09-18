import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import { getPortfolioFeedbacksCollection, type PortfolioFeedback } from "@backend/portfolio-feedbacks/models"

let indexesReady: Promise<void> | undefined

const ensureIndexes = async () => {
  if (!indexesReady) {
    indexesReady = (async () => {
      const collection = getPortfolioFeedbacksCollection(await getMongoDb())
      await Promise.all([
        collection.createIndex({ submittedAt: -1 }),
        collection.createIndex({ submittedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }),
        collection.createIndex({ visitorId: 1, submittedAt: -1 }),
      ])
    })()
  }

  await indexesReady
}

export const portfolioFeedbackRepository = {
  async create(input: Omit<PortfolioFeedback, "_id" | "createdAt" | "updatedAt">) {
    await ensureIndexes()
    const now = new Date()

    return (await getPortfolioFeedbacksCollection(await getMongoDb()).insertOne({
      ...input,
      createdAt: now,
      updatedAt: now,
    } as PortfolioFeedback)).insertedId
  },

  async list(cursor?: { submittedAt: Date; id: ObjectId }, limit = 50) {
    await ensureIndexes()
    const filter = cursor ? {
      $or: [
        { submittedAt: { $lt: cursor.submittedAt } },
        { submittedAt: cursor.submittedAt, _id: { $lt: cursor.id } },
      ],
    } : {}

    return getPortfolioFeedbacksCollection(await getMongoDb())
      .find(filter)
      .sort({ submittedAt: -1, _id: -1 })
      .limit(limit + 1)
      .toArray()
  },
}
