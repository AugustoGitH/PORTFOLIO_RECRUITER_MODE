import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import {
  getRecommendationAuditsCollection,
  getRecommendationsCollection,
  type DeveloperRecommendation,
  type RecommendationAudit,
  type RecommendationStatus,
} from "@backend/developer-recommendations/models"
import { getMediaAssetsCollection, type MediaAsset } from "@backend/feedback/models"

let indexesReady: Promise<void> | undefined

const ensureIndexes = async () => {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getMongoDb()

      await Promise.all([
        getRecommendationsCollection(db).createIndex({ slug: 1 }, { unique: true }),
        getRecommendationsCollection(db).createIndex({ status: 1, roleKinds: 1, seniority: 1 }),
        getRecommendationsCollection(db).createIndex({ status: 1, publishedAt: -1 }),
        getRecommendationAuditsCollection(db).createIndex({ recommendationId: 1, at: -1 }),
        getMediaAssetsCollection(db).createIndex({ key: 1 }, { unique: true }),
      ])
    })()
  }

  await indexesReady
}

export const recommendationRepository = {
  async list(status?: RecommendationStatus) {
    await ensureIndexes()
    const collection = getRecommendationsCollection(await getMongoDb())

    return collection.find(status ? { status } : {}).sort({ updatedAt: -1 }).toArray()
  },

  async find(id: string) {
    await ensureIndexes()
    if (!ObjectId.isValid(id)) return null

    return getRecommendationsCollection(await getMongoDb()).findOne({ _id: new ObjectId(id) })
  },

  async save(id: string | undefined, value: Omit<DeveloperRecommendation, "_id" | "createdAt" | "updatedAt">) {
    await ensureIndexes()
    const collection = getRecommendationsCollection(await getMongoDb())
    const now = new Date()

    if (id && ObjectId.isValid(id)) {
      const current = await collection.findOne({ _id: new ObjectId(id) })
      if (!current) return null

      await collection.updateOne(
        { _id: current._id },
        {
          $set: {
            ...value,
            publishedAt: value.status === "published" ? current.publishedAt ?? now : current.publishedAt,
            archivedAt: value.status === "archived" ? now : current.archivedAt,
            updatedAt: now,
          },
        },
      )

      return current._id
    }

    return (await collection.insertOne({
      ...value,
      publishedAt: value.status === "published" ? now : undefined,
      archivedAt: value.status === "archived" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    } as DeveloperRecommendation)).insertedId
  },

  async audit(value: Omit<RecommendationAudit, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()

    await getRecommendationAuditsCollection(await getMongoDb()).insertOne({
      ...value,
      createdAt: now,
      updatedAt: now,
    } as RecommendationAudit)
  },

  async createMedia(asset: Omit<MediaAsset, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()

    return (await getMediaAssetsCollection(await getMongoDb()).insertOne({
      ...asset,
      createdAt: now,
      updatedAt: now,
    } as MediaAsset)).insertedId
  },

  async findMediaById(id: ObjectId) {
    return getMediaAssetsCollection(await getMongoDb()).findOne({ _id: id, deletedAt: { $exists: false } })
  },

  async markMediaDeleted(id: ObjectId) {
    await getMediaAssetsCollection(await getMongoDb()).updateOne({ _id: id }, { $set: { deletedAt: new Date(), updatedAt: new Date() } })
  },
}
