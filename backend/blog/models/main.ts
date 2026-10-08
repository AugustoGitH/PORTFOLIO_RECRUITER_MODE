import "server-only"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"
import type { Language } from "@/constants/intl"

export type BlogPostStatus = "draft" | "published" | "archived"
export type BlogGlossaryStatus = "active" | "archived"

export type BlogGlossaryTranslation = {
  term: string
  definition: string
  aliases?: string[]
}

export type BlogGlossaryTranslations = Partial<Record<Language, BlogGlossaryTranslation>> & {
  ptbr: BlogGlossaryTranslation
}

export type BlogGlossaryEntry = MongoDocument & {
  key: string
  status: BlogGlossaryStatus
  translations: BlogGlossaryTranslations
}

export type BlogCategoryTranslation = {
  slug: string
  name: string
  description?: string
}

export type BlogPostTranslation = {
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
}

export type BlogCategoryTranslations = Partial<Record<Language, BlogCategoryTranslation>> & {
  ptbr: BlogCategoryTranslation
}

export type BlogPostTranslations = Partial<Record<Language, BlogPostTranslation>> & {
  ptbr: BlogPostTranslation
}

export type BlogCategory = MongoDocument & {
  translations?: BlogCategoryTranslations
  /** Legacy PT-BR mirrors kept temporarily for live-data compatibility. */
  slug: string
  name: string
  description?: string
}

export type BlogPost = MongoDocument & {
  status: BlogPostStatus
  translations?: BlogPostTranslations
  /** Legacy PT-BR mirrors kept temporarily for live-data compatibility. */
  slug: string
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

export type PublicBlogPostCover = {
  url: string
  width: number
  height: number
}

export type PublicBlogPost = {
  translations: BlogPostTranslations
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
  publishedAt?: Date
  categoryId: string
  cover?: PublicBlogPostCover
  views: number
  likes: number
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
export const getBlogGlossaryCollection = (db: Db): Collection<BlogGlossaryEntry> => db.collection("blog_glossary")
export const getBlogPostsCollection = (db: Db): Collection<BlogPost> => db.collection("blog_posts")
export const getBlogMetricsCollection = (db: Db): Collection<BlogMetric> => db.collection("blog_metrics")
export const getBlogAuditsCollection = (db: Db): Collection<BlogAudit> => db.collection("blog_audit")
