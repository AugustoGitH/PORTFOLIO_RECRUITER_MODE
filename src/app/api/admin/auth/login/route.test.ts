import { describe, expect, it, vi } from "vitest"

const login = vi.fn().mockResolvedValue(null)
const attemptCounts = new Map<string, number>()
const consumeLoginAttempt = vi.fn(async (scope: string, identifier: string) => {
  const key = `${scope}:${identifier}`
  const count = (attemptCounts.get(key) ?? 0) + 1
  attemptCounts.set(key, count)

  return {
    isLimited: count > 5,
    limit: 5,
    remaining: Math.max(0, 5 - count),
    retryAfterSeconds: 900,
  }
})

vi.mock("@backend/admin/services", () => ({
  adminAuthService: {
    consumeLoginAttempt,
    login,
    logout: vi.fn(),
    resetSuccessfulLoginRateLimits: vi.fn(),
  },
}))
vi.mock("@backend/admin/authorization", () => ({
  getVerifiedAdminSession: vi.fn(),
}))
vi.mock("@backend/admin/session", () => ({
  adminCookieName: "admin_session",
  adminCookieOptions: {},
  decryptAdminSession: vi.fn(),
}))

const { POST } = await import("./route")

describe("POST /api/admin/auth/login", () => {
  it("reports five attempts and rejects subsequent requests", async () => {
    const email = `${crypto.randomUUID()}@example.com`
    const ip = `test-${crypto.randomUUID()}`

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const response = await POST(new Request("http://localhost:5173/api/admin/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": ip,
        },
        body: JSON.stringify({ email, password: "incorrect-password" }),
      }))

      expect(response.status).toBe(401)
      expect(await response.json()).toMatchObject({
        attemptsRemaining: 5 - attempt,
      })
    }

    const blockedResponse = await POST(new Request("http://localhost:5173/api/admin/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({ email, password: "incorrect-password" }),
    }))

    expect(blockedResponse.status).toBe(429)
    expect(blockedResponse.headers.get("Retry-After")).toBe("900")
    expect(await blockedResponse.json()).toMatchObject({
      attemptsRemaining: 0,
      retryAfterSeconds: 900,
    })
    expect(login).toHaveBeenCalledTimes(5)
  })
})
