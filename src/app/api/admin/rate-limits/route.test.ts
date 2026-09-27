import { beforeEach, describe, expect, it, vi } from "vitest"

const listPublicRateLimitBuckets = vi.fn()
const resetRateLimit = vi.fn()
const getVerifiedAdminSession = vi.fn()

vi.mock("@backend/security/rate-limit/main", () => ({
  listPublicRateLimitBuckets,
  resetRateLimit,
}))
vi.mock("@backend/admin/authorization", () => ({
  getVerifiedAdminSession,
}))

const { DELETE, GET } = await import("./route")

describe("/api/admin/rate-limits", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getVerifiedAdminSession.mockResolvedValue({
      userId: "admin-id",
      permissions: ["rate-limits.manage"],
    })
  })

  it("lists active public buckets", async () => {
    listPublicRateLimitBuckets.mockResolvedValue([{
      scope: "feedback-submit",
      dimension: "ip",
      identifier: "203.0.113.10",
      count: 5,
      limit: 5,
      lastAttemptAt: new Date("2026-09-26T12:01:00.000Z"),
      expiresAt: new Date("2026-09-26T12:15:00.000Z"),
    }])

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([expect.objectContaining({
      scope: "feedback-submit",
      identifier: "203.0.113.10",
      isBlocked: true,
    })])
  })

  it("resets one public bucket", async () => {
    const response = await DELETE(new Request("http://localhost:5173/api/admin/rate-limits", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
      },
      body: JSON.stringify({
        scope: "feedback-submit",
        dimension: "ip",
        identifier: "203.0.113.10",
      }),
    }))

    expect(response.status).toBe(204)
    expect(resetRateLimit).toHaveBeenCalledWith(
      "feedback-submit",
      "ip",
      "203.0.113.10",
    )
  })

  it("does not allow the public controller to reset login buckets", async () => {
    const response = await DELETE(new Request("http://localhost:5173/api/admin/rate-limits", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
      },
      body: JSON.stringify({
        scope: "admin-login",
        dimension: "ip",
        identifier: "203.0.113.10",
      }),
    }))

    expect(response.status).toBe(400)
    expect(resetRateLimit).not.toHaveBeenCalled()
  })
})
