import "server-only"
import { combineRateLimits, consumeRateLimit } from "./rate-limit"
import type { RateLimitResult } from "./rate-limit"

const applyRateLimitHeaders = (
  headers: Headers,
  rateLimit: RateLimitResult,
) => {
  headers.set("RateLimit-Limit", String(rateLimit.limit))
  headers.set("RateLimit-Remaining", String(rateLimit.remaining))
  headers.set("RateLimit-Reset", String(rateLimit.retryAfterSeconds))
}

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

const idempotencyKeys = new Map<string, number>()

export const withRateLimit = <Context>(
  handler: (request: Request, context: Context) => Response | Promise<Response>,
  limits: { visitor: number; ip: number },
  scope: string,
  windowMs = 60_000,
) => async (request: Request, context: Context) => {
  const visitor = request.headers.get("cookie")?.match(/(?:^|;\s*)visitor_id=([^;]+)/)?.[1]

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rateLimits = await Promise.all([
    consumeRateLimit({
      scope,
      dimension: "ip",
      identifier: ip,
      limit: limits.ip,
      windowMs,
    }),
    ...(visitor ? [consumeRateLimit({
      scope,
      dimension: "visitor" as const,
      identifier: visitor,
      limit: limits.visitor,
      windowMs,
    })] : []),
  ])

  const rateLimit = combineRateLimits(...rateLimits)

  if (rateLimit.isLimited) {
    const response = Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    )

    applyRateLimitHeaders(response.headers, rateLimit)
    return response
  }

  const response = await handler(request, context)
  applyRateLimitHeaders(response.headers, rateLimit)
  return response
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
