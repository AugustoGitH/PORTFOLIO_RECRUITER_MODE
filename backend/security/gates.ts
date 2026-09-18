import "server-only"

/** Returns a 403 response for cross-origin writes, or null when allowed. */
export const requireSameOrigin = (request: Request): Response | null => {
  const origin = request.headers.get("origin")
  if (!origin) return null

  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  if (origin !== new URL(configuredOrigin).origin) {
    return Response.json({ error: "Forbidden origin" }, { status: 403 })
  }

  return null
}

export const withPublicControllerSecurity = (
  handler: (request: Request) => Response | Promise<Response>,
) => async (request: Request) => {
  const originError = requireSameOrigin(request)
  if (originError) return originError
  return handler(request)
}

const attempts = new Map<string, { startedAt: number; count: number }>()
const idempotencyKeys = new Map<string, number>()

const exceedsRateLimit = (key: string, limit: number, windowMs = 60_000) => {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || now - current.startedAt >= windowMs) {
    attempts.set(key, { startedAt: now, count: 1 })
    return false
  }
  current.count += 1
  return current.count > limit
}

export const withRateLimit = <Context>(
  handler: (request: Request, context: Context) => Response | Promise<Response>,
  limits: { visitor: number; ip: number },
  scope = "public",
  windowMs = 60_000,
) => async (request: Request, context: Context) => {
  const visitor = request.headers.get("cookie")?.match(/(?:^|;\s*)visitor_id=([^;]+)/)?.[1] ?? "anonymous"
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (exceedsRateLimit(`${scope}:visitor:${visitor}`, limits.visitor, windowMs) || exceedsRateLimit(`${scope}:ip:${ip}`, limits.ip, windowMs)) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) } })
  }
  return handler(request, context)
}

/** Prevents replay of a public write inside a bounded local development window. */
export const withIdempotency = <Context>(
  handler: (request: Request, context: Context) => Response | Promise<Response>,
  scope: string,
) => async (request: Request, context: Context) => {
  const key = request.headers.get("idempotency-key")
  if (!key || key.length > 128) return Response.json({ error: "Invalid request" }, { status: 400 })

  const now = Date.now()
  const entry = `${scope}:${key}`
  const previous = idempotencyKeys.get(entry)
  if (previous && now - previous < 15 * 60_000) return Response.json({ error: "Duplicate request" }, { status: 409 })

  idempotencyKeys.set(entry, now)
  return handler(request, context)
}
