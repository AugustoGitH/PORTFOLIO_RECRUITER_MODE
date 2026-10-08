import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import {
  getBlogCategoriesCollection,
  getBlogGlossaryCollection,
  getBlogAuditsCollection,
  getBlogMetricsCollection,
  getBlogPostsCollection,
  type BlogCategory,
  type BlogGlossaryEntry,
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
        getBlogGlossaryCollection(db).createIndex({ key: 1 }, { unique: true }),
        getBlogGlossaryCollection(db).createIndex({ status: 1, key: 1 }),
        getBlogPostsCollection(db).createIndex({ slug: 1 }, { unique: true }),
        getBlogCategoriesCollection(db).createIndex(
          { "translations.en.slug": 1 },
          { unique: true, sparse: true },
        ),
        getBlogPostsCollection(db).createIndex(
          { "translations.en.slug": 1 },
          { unique: true, sparse: true },
        ),
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
  async listGlossaryEntries(keys?: string[]) {
    await ensureIndexes()
    return getBlogGlossaryCollection(await getMongoDb())
      .find(keys?.length ? { key: { $in: keys } } : {})
      .sort({ key: 1 })
      .toArray()
  },

  async findGlossaryEntry(id: string) {
    if (!ObjectId.isValid(id)) return null
    return getBlogGlossaryCollection(await getMongoDb()).findOne({ _id: new ObjectId(id) })
  },

  async saveGlossaryEntry(
    id: string | undefined,
    input: Omit<BlogGlossaryEntry, "_id" | "createdAt" | "updatedAt">,
  ) {
    await ensureIndexes()
    const collection = getBlogGlossaryCollection(await getMongoDb())
    const now = new Date()

    if (id && ObjectId.isValid(id)) {
      const current = await collection.findOne({ _id: new ObjectId(id) })
      if (!current) return null
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...input, key: current.key, updatedAt: now } },
      )
      return result.matchedCount === 1 ? current._id : null
    }

    return (await collection.insertOne({
      ...input,
      createdAt: now,
      updatedAt: now,
    } as BlogGlossaryEntry)).insertedId
  },

  async deleteGlossaryEntry(id: string) {
    if (!ObjectId.isValid(id)) return false
    return (await getBlogGlossaryCollection(await getMongoDb()).deleteOne({
      _id: new ObjectId(id),
    })).deletedCount === 1
  },

  async hasGlossaryReferences(key: string) {
    const reference = new RegExp(`#glossary:${key}(?:\\)|\\s)`)
    return Boolean(await getBlogPostsCollection(await getMongoDb()).findOne({
      $or: [
        { markdown: reference },
        { "translations.ptbr.markdown": reference },
        { "translations.en.markdown": reference },
      ],
    }, { projection: { _id: 1 } }))
  },

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
    return getBlogPostsCollection(await getMongoDb()).findOne({
      $or: [
        { slug },
        { "translations.ptbr.slug": slug },
        { "translations.en.slug": slug },
      ],
    })
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
      const { subtitle, ...rest } = input

      await collection.updateOne({ _id: current._id }, {
        $set: {
          ...rest,
          ...(subtitle ? { subtitle } : {}),
          publishedAt: input.status === "published" ? current.publishedAt ?? now : current.publishedAt,
          archivedAt: input.status === "archived" ? now : current.archivedAt,
          updatedAt: now,
        },
        ...(!subtitle ? { $unset: { subtitle: "" } } : {}),
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

  async addPostMedia(id: string, mediaId: ObjectId, updatedBy: ObjectId) {
    if (!ObjectId.isValid(id)) return false

    const result = await getBlogPostsCollection(await getMongoDb()).updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { mediaIds: mediaId },
        $set: { updatedAt: new Date(), updatedBy },
      },
    )

    return result.matchedCount === 1
  },

  async replaceCoverMedia(id: string, mediaId: ObjectId, updatedBy: ObjectId) {
    if (!ObjectId.isValid(id)) return null

    const previous = await getBlogPostsCollection(await getMongoDb()).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          coverMediaId: mediaId,
          updatedAt: new Date(),
          updatedBy,
        },
      },
      { returnDocument: "before" },
    )

    return previous
      ? { previousCoverMediaId: previous.coverMediaId }
      : null
  },

  async detachMedia(id: string, mediaId: ObjectId, updatedBy: ObjectId, removeCover: boolean) {
    if (!ObjectId.isValid(id)) return false

    const result = await getBlogPostsCollection(await getMongoDb()).updateOne(
      removeCover
        ? { _id: new ObjectId(id), coverMediaId: mediaId }
        : { _id: new ObjectId(id) },
      removeCover
        ? {
            $pull: { mediaIds: mediaId },
            $unset: { coverMediaId: "" },
            $set: { updatedAt: new Date(), updatedBy },
          }
        : {
            $pull: { mediaIds: mediaId },
            $set: { updatedAt: new Date(), updatedBy },
          },
    )

    return result.matchedCount === 1
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

  async findMediaByIds(ids: ObjectId[]) {
    if (!ids.length) return []

    return getMediaAssetsCollection(await getMongoDb())
      .find({ _id: { $in: ids }, deletedAt: { $exists: false } })
      .toArray()
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
