import "server-only"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"

export const FEEDBACK_STATUSES = ["pending", "approved", "published", "rejected", "archived", "redacted"] as const
export type FeedbackStatus = typeof FEEDBACK_STATUSES[number]

export type FeedbackEditorial = {
  displayName: string
  role?: string
  company?: string
  publicMessage: string
  profileImageId?: ObjectId
  companyImageId?: ObjectId
  linkedinUrl?: string
}

export type Feedback = MongoDocument & {
  visitorId: string
  message: string
  linkedinUrl?: string
  consent: { publishedAt: Date; version: string }
  status: FeedbackStatus
  editorial?: FeedbackEditorial
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: ObjectId
  publishedAt?: Date
  retentionDeleteAt?: Date
}

export type FeedbackAudit = MongoDocument & {
  feedbackId: ObjectId
  action: "submitted" | "moderated" | "removed"
  actorId?: ObjectId
  at: Date
}

export type PublicFeedback = {
  id: string
  publicMessage: string
  displayName: string
  role?: string
  company?: string
  profileImageUrl?: string
  companyImageUrl?: string
}

export type MediaAsset = MongoDocument & { provider: "r2"; bucket: string; key: string; contentType: "image/webp"; width: number; height: number; bytes: number; publicUrl: string; createdBy: ObjectId; deletedAt?: Date }

export const getFeedbacksCollection = (db: Db): Collection<Feedback> => db.collection("feedbacks")
export const getFeedbackAuditsCollection = (db: Db): Collection<FeedbackAudit> => db.collection("feedback_audit")
export const getMediaAssetsCollection = (db: Db): Collection<MediaAsset> => db.collection("media_assets")
