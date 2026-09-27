import "server-only"
import { cookies } from "next/headers"
import { adminAuthService } from "@backend/admin/services"
import { adminCookieName, adminCookieOptions, decryptAdminSession } from "@backend/admin/session"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import type { AdminLoginRateLimitResult } from "@backend/admin/services"
import { adminLoginSchema } from "./schemas"

const ADMIN_LOGIN_ATTEMPT_LIMIT = 5
const ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60_000

const rateLimitHeaders = (rateLimit: AdminLoginRateLimitResult) => ({
  "Cache-Control": "no-store",
  "RateLimit-Limit": String(rateLimit.limit),
  "RateLimit-Remaining": String(rateLimit.remaining),
  "RateLimit-Reset": String(rateLimit.retryAfterSeconds),
})

const strictestRateLimit = (
  first: AdminLoginRateLimitResult,
  second: AdminLoginRateLimitResult,
): AdminLoginRateLimitResult => {
  const exhaustedLimits = [first, second].filter(({ remaining }) => remaining === 0)

  return {
    isLimited: first.isLimited || second.isLimited,
    limit: Math.min(first.limit, second.limit),
    remaining: Math.min(first.remaining, second.remaining),
    retryAfterSeconds: Math.max(
      ...(exhaustedLimits.length > 0 ? exhaustedLimits : [first, second])
        .map(({ retryAfterSeconds }) => retryAfterSeconds),
    ),
  }
}

export const adminAuthController = {
  async login(request: Request) {
    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 })
    const parsed = adminLoginSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid credentials" }, { status: 400 })
    const body = parsed.data
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const [ipRateLimit, emailRateLimit] = await Promise.all([
      adminAuthService.consumeLoginAttempt(
        "ip",
        ip,
        ADMIN_LOGIN_ATTEMPT_LIMIT,
        ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
      ),
      adminAuthService.consumeLoginAttempt(
        "email",
        body.email,
        ADMIN_LOGIN_ATTEMPT_LIMIT,
        ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
      ),
    ])
    const rateLimit = strictestRateLimit(ipRateLimit, emailRateLimit)

    if (rateLimit.isLimited) {
      return Response.json(
        {
          error: "Too many attempts",
          attemptsRemaining: 0,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders(rateLimit),
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      )
    }

    const result = await adminAuthService.login(body.email, body.password)
    if (!result) {
      return Response.json(
        {
          error: "Invalid credentials",
          attemptsRemaining: rateLimit.remaining,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 401, headers: rateLimitHeaders(rateLimit) },
      )
    }

    await adminAuthService.resetSuccessfulLoginRateLimits(ip, body.email)
    ;(await cookies()).set(adminCookieName, result.token, adminCookieOptions)
    return Response.json(
      { permissions: result.permissions },
      { headers: rateLimitHeaders(rateLimit) },
    )
  },
  async listLoginAttempts() {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    if (!session.permissions.includes("admin.login-attempts.manage")) return Response.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } })

    const rateLimits = await adminAuthService.listLoginIpRateLimits(
      ADMIN_LOGIN_ATTEMPT_LIMIT,
    )

    return Response.json(rateLimits.map((rateLimit) => ({
      ...rateLimit,
      windowStartedAt: rateLimit.windowStartedAt.toISOString(),
      lastAttemptAt: rateLimit.lastAttemptAt.toISOString(),
      expiresAt: rateLimit.expiresAt.toISOString(),
    })), { headers: { "Cache-Control": "no-store" } })
  },
  async resetLoginAttempts(request: Request) {
    const session = await getVerifiedAdminSession()
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    if (!session.permissions.includes("admin.login-attempts.manage")) return Response.json({ error: "Forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } })

    const body = await request.json().catch(() => null)
    if (!body || typeof body.ip !== "string" || body.ip.length < 1 || body.ip.length > 255) {
      return Response.json({ error: "Invalid IP" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    await adminAuthService.resetLoginIpRateLimit(body.ip)
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } })
  },
  async logout(request: Request) {
    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 })
    const cookieStore = await cookies()
    const claims = await decryptAdminSession(cookieStore.get(adminCookieName)?.value)
    if (claims) await adminAuthService.logout(claims.sid)
    cookieStore.delete(adminCookieName)
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } })
  },
}
