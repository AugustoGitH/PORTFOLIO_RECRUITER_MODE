import "server-only"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"

export type BlogPostStatus = "draft" | "published" | "archived"

export type BlogCategory = MongoDocument & {
  slug: string
  name: string
  description?: string
}

export type BlogPost = MongoDocument & {
  slug: string
  status: BlogPostStatus
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
  categoryId: ObjectId
  coverMediaId?: ObjectId
  mediaIds?: ObjectId[]
  publishedAt?: Date
  archivedAt?: Date
  createdBy: ObjectId
  updatedBy: ObjectId
}

export type BlogMetric = MongoDocument & {
  postId: ObjectId
  visitorId: string
  viewedAt?: Date
  likedAt?: Date
}

export type BlogAudit = MongoDocument & {
  postId?: ObjectId
  categoryId?: ObjectId
  actorId: ObjectId
  action: "created" | "updated" | "published" | "archived" | "removed" | "image_attached" | "cover_updated" | "cover_removed"
  at: Date
}

export const getBlogCategoriesCollection = (db: Db): Collection<BlogCategory> => db.collection("blog_categories")
export const getBlogPostsCollection = (db: Db): Collection<BlogPost> => db.collection("blog_posts")
export const getBlogMetricsCollection = (db: Db): Collection<BlogMetric> => db.collection("blog_metrics")
export const getBlogAuditsCollection = (db: Db): Collection<BlogAudit> => db.collection("blog_audit")
