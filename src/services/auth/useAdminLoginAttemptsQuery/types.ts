export type AdminLoginRateLimit = {
  ip: string
  count: number
  attemptsRemaining: number
  isBlocked: boolean
  windowStartedAt: string
  lastAttemptAt: string
  expiresAt: string
}
