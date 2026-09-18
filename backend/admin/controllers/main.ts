import "server-only"
import { cookies } from "next/headers"
import { adminAuthService } from "@backend/admin/services"
import { adminCookieName, adminCookieOptions, decryptAdminSession } from "@backend/admin/session"
import { isRateLimited } from "@backend/metrics/utils"
import { adminLoginSchema } from "./schemas"

export const adminAuthController = {
  async login(request: Request) {
    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL ?? request.url).origin) return Response.json({ error: "Forbidden" }, { status: 403 })
    const parsed = adminLoginSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: "Invalid credentials" }, { status: 400 })
    const body = parsed.data
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(`${ip}:${body.email.trim().toLowerCase()}`, 5, 900_000)) return Response.json({ error: "Too many attempts" }, { status: 429, headers: { "Retry-After": "900" } })
    const result = await adminAuthService.login(body.email, body.password)
    if (!result) return Response.json({ error: "Invalid credentials" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    ;(await cookies()).set(adminCookieName, result.token, adminCookieOptions)
    return Response.json({ permissions: result.permissions }, { headers: { "Cache-Control": "no-store" } })
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
