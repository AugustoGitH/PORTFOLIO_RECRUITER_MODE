import "server-only"

import { getMongoDb } from "@backend/libs/db/mongo"
import { getLikesCollection, getViewsCollection, ViewType, type Like, type View } from "@backend/metrics/models"

const ensureIndexes = async (collection: ReturnType<typeof getViewsCollection>) => {
  await collection.createIndex({ dedupeKey: 1 }, { unique: true })
  await collection.createIndex({ type: 1 })
}

export const metricsRepository = {
  async countLikes() {
    const collection = getLikesCollection(await getMongoDb())
    await collection.createIndex({ visitorId: 1 }, { unique: true })
    return collection.countDocuments()
  },

  async hasLike(visitorId: string) {
    const collection = getLikesCollection(await getMongoDb())
    return Boolean(await collection.findOne({ visitorId }))
  },

  async toggleLike(visitorId: string) {
    const collection = getLikesCollection(await getMongoDb())
    await collection.createIndex({ visitorId: 1 }, { unique: true })
    const existing = await collection.findOne({ visitorId })
    if (existing) {
      await collection.deleteOne({ _id: existing._id })
      return false
    }

    await collection.insertOne({ visitorId, createdAt: new Date(), updatedAt: new Date() } as Like)
    return true
  },

  async recordPortfolioView(visitorId: string, dedupeKey: string) {
    const collection = getViewsCollection(await getMongoDb())
    await ensureIndexes(collection)

    try {
      await collection.insertOne({
        type: ViewType.Portfolio,
        visitorId,
        dedupeKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as View)
    } catch (error: unknown) {
      if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error
    }

    return this.countPortfolioViews()
  },

  async countPortfolioViews() {
    const collection = getViewsCollection(await getMongoDb())
    return collection.countDocuments({ type: ViewType.Portfolio })
  },

  async recordResumeView(visitorId: string, locale: string, slug: string) {
    const collection = getViewsCollection(await getMongoDb())
    await collection.insertOne({ type: ViewType.Resume, visitorId, locale, slug, createdAt: new Date(), updatedAt: new Date() } as View)
    return this.countResumeViews()
  },

  async countResumeViews() {
    const collection = getViewsCollection(await getMongoDb())
    return collection.countDocuments({ type: ViewType.Resume })
  },
}
