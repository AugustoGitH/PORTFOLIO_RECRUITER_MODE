import { beforeEach, describe, expect, it, vi } from "vitest"

const listLoginIpRateLimits = vi.fn()
const resetLoginIpRateLimit = vi.fn()
const getVerifiedAdminSession = vi.fn()

vi.mock("@backend/admin/services", () => ({
  adminAuthService: {
    listLoginIpRateLimits,
    resetLoginIpRateLimit,
  },
}))
vi.mock("@backend/admin/authorization", () => ({
  getVerifiedAdminSession,
}))
vi.mock("@backend/admin/session", () => ({
  adminCookieName: "admin_session",
  adminCookieOptions: {},
  decryptAdminSession: vi.fn(),
}))

const { DELETE, GET } = await import("./route")

describe("/api/admin/auth/login-attempts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getVerifiedAdminSession.mockResolvedValue({
      userId: "admin-id",
      permissions: ["admin.login-attempts.manage"],
    })
  })

  it("lists active IP attempt windows for an authorized administrator", async () => {
    listLoginIpRateLimits.mockResolvedValue([{
      ip: "203.0.113.10",
      count: 5,
      attemptsRemaining: 0,
      isBlocked: true,
      windowStartedAt: new Date("2026-09-26T12:00:00.000Z"),
      lastAttemptAt: new Date("2026-09-26T12:01:00.000Z"),
      expiresAt: new Date("2026-09-26T12:15:00.000Z"),
    }])

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([expect.objectContaining({
      ip: "203.0.113.10",
      isBlocked: true,
      expiresAt: "2026-09-26T12:15:00.000Z",
    })])
  })

  it("resets the attempt bucket for an IP", async () => {
    const response = await DELETE(new Request("http://localhost:5173/api/admin/auth/login-attempts", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
      },
      body: JSON.stringify({ ip: "203.0.113.10" }),
    }))

    expect(response.status).toBe(204)
    expect(resetLoginIpRateLimit).toHaveBeenCalledWith("203.0.113.10")
  })

  it("rejects access without the management permission", async () => {
    getVerifiedAdminSession.mockResolvedValue({
      userId: "admin-id",
      permissions: [],
    })

    const response = await GET()

    expect(response.status).toBe(403)
    expect(listLoginIpRateLimits).not.toHaveBeenCalled()
  })
})
