const attempts = new Map<string, { startedAt: number; count: number }>()
const DEFAULT_WINDOW_MS = 60_000

export const isRateLimited = (key: string, limit: number, windowMs = DEFAULT_WINDOW_MS) => {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || now - current.startedAt >= windowMs) {
    attempts.set(key, { startedAt: now, count: 1 })
    return false
  }
  current.count += 1
  return current.count > limit
}
