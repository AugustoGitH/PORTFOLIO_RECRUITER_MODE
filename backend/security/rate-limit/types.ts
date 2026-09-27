export type RateLimitDimension = "ip" | "visitor" | "email"

export type RateLimitBucket = {
  scope: string
  dimension: RateLimitDimension
  identifier: string
  limit: number
  count: number
  windowStartedAt: Date
  lastAttemptAt: Date
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export type RateLimitResult = {
  isLimited: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

export type ConsumeRateLimitInput = {
  scope: string
  dimension: RateLimitDimension
  identifier: string
  limit: number
  windowMs: number
}
