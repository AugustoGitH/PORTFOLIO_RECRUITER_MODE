import "server-only"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"
import type { RecommendationSkillValue } from "@backend/developer-recommendations/catalog"

export type RecommendationStatus = "draft" | "published" | "paused" | "archived"
export type RecommendationRole = "frontend" | "backend" | "database" | "tests" | "architecture" | "tools"
export type RecommendationSeniority = "junior" | "mid-level" | "senior"

export type DeveloperRecommendation = MongoDocument & {
  slug: string
  status: RecommendationStatus
  displayName: string
  headline: string
  seniority: RecommendationSeniority
  roleKinds: RecommendationRole[]
  skills: RecommendationSkillValue[]
  summary?: string
  availability?: string
  contact: { label: string; url: string }
  avatarMediaId?: ObjectId
  editorialPriority: number
  consent: { grantedAt: Date; version: string; confirmedAt: Date }
  publishedAt?: Date
  archivedAt?: Date
}

export type PublicRecommendation = {
  id: string
  displayName: string
  headline: string
  seniority: RecommendationSeniority
  skills: RecommendationSkillValue[]
  matchingRoles: RecommendationRole[]
  avatarUrl?: string
  summary?: string
  availability?: string
  contact: DeveloperRecommendation["contact"]
}

export type RecommendationAudit = MongoDocument & {
  recommendationId: ObjectId
  actorId: ObjectId
  action: "created" | "updated" | "published" | "paused" | "archived"
  at: Date
}

export const getRecommendationsCollection = (db: Db): Collection<DeveloperRecommendation> =>
  db.collection("developer_recommendations")

export const getRecommendationAuditsCollection = (db: Db): Collection<RecommendationAudit> =>
  db.collection("developer_recommendation_audit")
