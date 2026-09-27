export type AdminPublicRateLimit = {
  scope: string
  dimension: "ip" | "visitor"
  identifier: string
  count: number
  limit: number
  isBlocked: boolean
  lastAttemptAt: string
  expiresAt: string
}
