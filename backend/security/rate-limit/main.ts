import "server-only"

import type { Collection } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import type {
  ConsumeRateLimitInput,
  RateLimitBucket,
  RateLimitDimension,
  RateLimitResult,
} from "./types"

let indexesReady: Promise<unknown> | undefined

const getRateLimitBuckets = async (): Promise<Collection<RateLimitBucket>> => {
  const collection = (await getMongoDb()).collection<RateLimitBucket>("rate_limits")

  indexesReady ??= Promise.all([
    collection.createIndex(
      { scope: 1, dimension: 1, identifier: 1 },
      { unique: true },
    ),
    collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    collection.createIndex({ scope: 1, dimension: 1, lastAttemptAt: -1 }),
  ])
  await indexesReady

  return collection
}

export const consumeRateLimit = async ({
  scope,
  dimension,
  identifier,
  limit,
  windowMs,
}: ConsumeRateLimitInput): Promise<RateLimitResult> => {
  const collection = await getRateLimitBuckets()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + windowMs)
  const activeWindow = { $gt: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] }
  const bucket = await collection.findOneAndUpdate(
    { scope, dimension, identifier },
    [{
      $set: {
        scope,
        dimension,
        identifier,
        limit,
        count: {
          $cond: [
            activeWindow,
            { $add: [{ $ifNull: ["$count", 0] }, 1] },
            1,
          ],
        },
        windowStartedAt: { $cond: [activeWindow, "$windowStartedAt", now] },
        lastAttemptAt: now,
        expiresAt: { $cond: [activeWindow, "$expiresAt", expiresAt] },
        createdAt: { $ifNull: ["$createdAt", now] },
        updatedAt: now,
      },
    }],
    { upsert: true, returnDocument: "after" },
  )

  if (!bucket) throw new Error("Unable to persist the rate limit")

  return {
    isLimited: bucket.count > limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((bucket.expiresAt.getTime() - Date.now()) / 1000),
    ),
  }
}

export const combineRateLimits = (
  ...rateLimits: RateLimitResult[]
): RateLimitResult => {
  const exhaustedLimits = rateLimits.filter(({ remaining }) => remaining === 0)
  const resetCandidates = exhaustedLimits.length > 0
    ? exhaustedLimits
    : rateLimits

  return {
    isLimited: rateLimits.some(({ isLimited }) => isLimited),
    limit: Math.min(...rateLimits.map(({ limit }) => limit)),
    remaining: Math.min(...rateLimits.map(({ remaining }) => remaining)),
    retryAfterSeconds: Math.max(
      ...resetCandidates.map(({ retryAfterSeconds }) => retryAfterSeconds),
    ),
  }
}

export const listRateLimitBuckets = async (
  scope: string,
  dimension: RateLimitDimension,
) => (await getRateLimitBuckets())
  .find({ scope, dimension, expiresAt: { $gt: new Date() } })
  .sort({ lastAttemptAt: -1 })
  .limit(100)
  .toArray()

export const listPublicRateLimitBuckets = async () => (
  await getRateLimitBuckets()
)
  .find({
    scope: { $ne: "admin-login" },
    expiresAt: { $gt: new Date() },
  })
  .sort({ lastAttemptAt: -1 })
  .limit(200)
  .toArray()

export const resetRateLimit = async (
  scope: string,
  dimension: RateLimitDimension,
  identifier: string,
) => (await getRateLimitBuckets()).deleteOne({
  scope,
  dimension,
  identifier,
})
