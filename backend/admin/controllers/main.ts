import "server-only"
import { cookies } from "next/headers"
import { adminAuthService } from "@backend/admin/services"
import { adminCookieName, adminCookieOptions } from "@backend/admin/session"

const attempts = new Map<string, { count: number; startedAt: number }>()
const isRateLimited = (key: string) => { const now = Date.now(); const current = attempts.get(key); if (!current || now - current.startedAt > 900_000) { attempts.set(key, { count: 1, startedAt: now }); return false }; current.count += 1; return current.count > 5 }
export const adminAuthController = {
  async login(request: Request) {
    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 })
    const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null
    if (!body || typeof body.email !== "string" || typeof body.password !== "string" || body.email.length > 254 || body.password.length > 1024) return Response.json({ error: "Invalid credentials" }, { status: 400 })
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(`${ip}:${body.email.trim().toLowerCase()}`)) return Response.json({ error: "Too many attempts" }, { status: 429, headers: { "Retry-After": "900" } })
    const result = await adminAuthService.login(body.email, body.password)
    if (!result) return Response.json({ error: "Invalid credentials" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    ;(await cookies()).set(adminCookieName, result.token, adminCookieOptions)
    return Response.json({ permissions: result.permissions }, { headers: { "Cache-Control": "no-store" } })
  },
  async logout() { ;(await cookies()).delete(adminCookieName); return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }) },
}
