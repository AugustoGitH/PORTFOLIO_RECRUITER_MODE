import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import { getFeedbackAuditsCollection, getFeedbacksCollection, getMediaAssetsCollection, type Feedback, type FeedbackAudit, type FeedbackStatus, type MediaAsset } from "@backend/feedback/models"

let indexesReady: Promise<void> | undefined

const ensureIndexes = async () => {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getMongoDb()
      await Promise.all([
        getFeedbacksCollection(db).createIndex({ status: 1, publishedAt: -1 }),
        getFeedbacksCollection(db).createIndex({ status: 1, submittedAt: -1 }),
        getFeedbacksCollection(db).createIndex({ status: 1, updatedAt: -1, submittedAt: -1 }),
        getFeedbacksCollection(db).createIndex({ updatedAt: -1, submittedAt: -1 }),
        getFeedbacksCollection(db).createIndex({ visitorId: 1 }, { unique: true, partialFilterExpression: { visitorId: { $type: "string" } } }),
        getFeedbacksCollection(db).createIndex({ retentionDeleteAt: 1 }, { expireAfterSeconds: 0 }),
        getFeedbackAuditsCollection(db).createIndex({ feedbackId: 1, at: -1 }),
        getMediaAssetsCollection(db).createIndex({ key: 1 }, { unique: true }),
      ])
    })()
  }
  await indexesReady
}

export const feedbackRepository = {
  async create(feedback: Omit<Feedback, "_id" | "createdAt" | "updatedAt">) {
    await ensureIndexes()
    const now = new Date()
    const result = await getFeedbacksCollection(await getMongoDb()).insertOne({ ...feedback, createdAt: now, updatedAt: now } as Feedback)
    return result.insertedId
  },
  async listPublished() {
    await ensureIndexes()
    return getFeedbacksCollection(await getMongoDb()).find({ status: "published" }).sort({ publishedAt: -1 }).toArray()
  },
  async listByStatus(status: FeedbackStatus) {
    await ensureIndexes()
    return getFeedbacksCollection(await getMongoDb()).find({ status }).sort({ updatedAt: -1, submittedAt: -1 }).toArray()
  },
  async listAll() { await ensureIndexes(); return getFeedbacksCollection(await getMongoDb()).find({}).sort({ updatedAt: -1, submittedAt: -1 }).toArray() },
  async findByVisitorId(visitorId: string) {
    return getFeedbacksCollection(await getMongoDb()).findOne({ visitorId })
  },
  async findById(id: string) {
    if (!ObjectId.isValid(id)) return null
    return getFeedbacksCollection(await getMongoDb()).findOne({ _id: new ObjectId(id) })
  },
  async update(id: ObjectId, update: Partial<Feedback>) {
    await getFeedbacksCollection(await getMongoDb()).updateOne({ _id: id }, { $set: { ...update, updatedAt: new Date() } })
    return getFeedbacksCollection(await getMongoDb()).findOne({ _id: id })
  },
  async remove(id: ObjectId) { await getFeedbacksCollection(await getMongoDb()).deleteOne({ _id: id }) },
  async createMedia(asset: Omit<MediaAsset, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()
    return (await getMediaAssetsCollection(await getMongoDb()).insertOne({ ...asset, createdAt: now, updatedAt: now } as MediaAsset)).insertedId
  },
  async findMediaById(id: ObjectId) { return getMediaAssetsCollection(await getMongoDb()).findOne({ _id: id, deletedAt: { $exists: false } }) },
  async markMediaDeleted(id: ObjectId) { await getMediaAssetsCollection(await getMongoDb()).updateOne({ _id: id }, { $set: { deletedAt: new Date(), updatedAt: new Date() } }) },
  async audit(audit: Omit<FeedbackAudit, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()
    await getFeedbackAuditsCollection(await getMongoDb()).insertOne({ ...audit, createdAt: now, updatedAt: now } as FeedbackAudit)
  },
}
