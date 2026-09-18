import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import {
  getBlogCategoriesCollection,
  getBlogAuditsCollection,
  getBlogMetricsCollection,
  getBlogPostsCollection,
  type BlogCategory,
  type BlogAudit,
  type BlogPost,
  type BlogPostStatus,
} from "@backend/blog/models"
import { getMediaAssetsCollection, type MediaAsset } from "@backend/feedback/models"

let indexesReady: Promise<void> | undefined

const ensureIndexes = async () => {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getMongoDb()

      await Promise.all([
        getBlogCategoriesCollection(db).createIndex({ slug: 1 }, { unique: true }),
        getBlogPostsCollection(db).createIndex({ slug: 1 }, { unique: true }),
        getBlogPostsCollection(db).createIndex({ status: 1, publishedAt: -1 }),
        getBlogPostsCollection(db).createIndex({ categoryId: 1, status: 1, publishedAt: -1 }),
        getBlogMetricsCollection(db).createIndex({ postId: 1, visitorId: 1 }, { unique: true }),
        getBlogMetricsCollection(db).createIndex({ postId: 1, viewedAt: -1 }),
        getBlogAuditsCollection(db).createIndex({ postId: 1, at: -1 }),
        getMediaAssetsCollection(db).createIndex({ key: 1 }, { unique: true }),
      ])
    })()
  }

  await indexesReady
}

export const blogRepository = {
  async listCategories() {
    await ensureIndexes()
    return getBlogCategoriesCollection(await getMongoDb()).find({}).sort({ name: 1 }).toArray()
  },

  async saveCategory(id: string | undefined, input: Omit<BlogCategory, "_id" | "createdAt" | "updatedAt">) {
    await ensureIndexes()
    const collection = getBlogCategoriesCollection(await getMongoDb())
    const now = new Date()

    if (id && ObjectId.isValid(id)) {
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...input, updatedAt: now } })
      return new ObjectId(id)
    }

    return (await collection.insertOne({ ...input, createdAt: now, updatedAt: now } as BlogCategory)).insertedId
  },

  async deleteCategory(id: string) {
    if (!ObjectId.isValid(id)) return false
    const categoryId = new ObjectId(id)
    const hasPosts = await getBlogPostsCollection(await getMongoDb()).findOne({ categoryId })
    if (hasPosts) return null

    return (await getBlogCategoriesCollection(await getMongoDb()).deleteOne({ _id: categoryId })).deletedCount === 1
  },

  async listPosts(status?: BlogPostStatus) {
    await ensureIndexes()
    return getBlogPostsCollection(await getMongoDb())
      .find(status ? { status } : {})
      .sort({ publishedAt: -1, updatedAt: -1 })
      .toArray()
  },

  async findPostBySlug(slug: string) {
    await ensureIndexes()
    return getBlogPostsCollection(await getMongoDb()).findOne({ slug })
  },

  async findPost(id: string) {
    if (!ObjectId.isValid(id)) return null
    return getBlogPostsCollection(await getMongoDb()).findOne({ _id: new ObjectId(id) })
  },

  async savePost(id: string | undefined, input: Omit<BlogPost, "_id" | "createdAt" | "updatedAt">) {
    await ensureIndexes()
    const collection = getBlogPostsCollection(await getMongoDb())
    const now = new Date()

    if (id && ObjectId.isValid(id)) {
      const current = await this.findPost(id)
      if (!current) return null

      await collection.updateOne({ _id: current._id }, {
        $set: {
          ...input,
          publishedAt: input.status === "published" ? current.publishedAt ?? now : current.publishedAt,
          archivedAt: input.status === "archived" ? now : current.archivedAt,
          updatedAt: now,
        },
      })

      return current._id
    }

    return (await collection.insertOne({
      ...input,
      publishedAt: input.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    } as BlogPost)).insertedId
  },

  async deletePost(id: string) {
    if (!ObjectId.isValid(id)) return false
    return (await getBlogPostsCollection(await getMongoDb()).deleteOne({ _id: new ObjectId(id) })).deletedCount === 1
  },

  async createMedia(asset: Omit<MediaAsset, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()
    return (await getMediaAssetsCollection(await getMongoDb()).insertOne({ ...asset, createdAt: now, updatedAt: now } as MediaAsset)).insertedId
  },

  async findMedia(id: ObjectId) {
    return getMediaAssetsCollection(await getMongoDb()).findOne({ _id: id, deletedAt: { $exists: false } })
  },

  async markMediaDeleted(id: ObjectId) {
    await getMediaAssetsCollection(await getMongoDb()).updateOne({ _id: id }, { $set: { deletedAt: new Date(), updatedAt: new Date() } })
  },

  async audit(value: Omit<BlogAudit, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()
    await getBlogAuditsCollection(await getMongoDb()).insertOne({ ...value, createdAt: now, updatedAt: now } as BlogAudit)
  },

  async recordView(postId: ObjectId, visitorId: string) {
    const now = new Date()
    await getBlogMetricsCollection(await getMongoDb()).updateOne(
      { postId, visitorId },
      { $setOnInsert: { postId, visitorId, viewedAt: now, createdAt: now, updatedAt: now } },
      { upsert: true },
    )
  },

  async toggleLike(postId: ObjectId, visitorId: string) {
    const collection = getBlogMetricsCollection(await getMongoDb())
    const current = await collection.findOne({ postId, visitorId })
    const now = new Date()

    if (current?.likedAt) {
      await collection.updateOne({ _id: current._id }, { $unset: { likedAt: "" }, $set: { updatedAt: now } })
    } else {
      await collection.updateOne({ postId, visitorId }, { $set: { postId, visitorId, likedAt: now, createdAt: now, updatedAt: now } }, { upsert: true })
    }

    return !current?.likedAt
  },

  async getTotals(postIds: ObjectId[]) {
    const rows = await getBlogMetricsCollection(await getMongoDb()).aggregate<{ _id: ObjectId; views: number; likes: number }>([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: "$postId", views: { $sum: { $cond: [{ $ne: ["$viewedAt", null] }, 1, 0] } }, likes: { $sum: { $cond: [{ $ne: ["$likedAt", null] }, 1, 0] } } } },
    ]).toArray()

    return new Map(rows.map((row) => [row._id.toHexString(), { views: row.views, likes: row.likes }]))
  },
}
