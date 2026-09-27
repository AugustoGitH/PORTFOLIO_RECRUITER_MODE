import { beforeEach, describe, expect, it, vi } from "vitest"

const consumeRateLimit = vi.fn()

vi.mock("./rate-limit", async (importOriginal) => ({
  ...await importOriginal<typeof import("./rate-limit")>(),
  consumeRateLimit,
}))

const { withRateLimit } = await import("./gates")

describe("withRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 429 with the persisted retry time when an IP is limited", async () => {
    consumeRateLimit.mockResolvedValue({
      isLimited: true,
      limit: 10,
      remaining: 0,
      retryAfterSeconds: 37,
    })
    const handler = vi.fn()
    const limitedHandler = withRateLimit(
      handler,
      { visitor: 3, ip: 10 },
      "resume-download",
    )

    const response = await limitedHandler(
      new Request("http://localhost:5173/api/resumes/default", {
        headers: { "x-forwarded-for": "203.0.113.10" },
      }),
      undefined,
    )

    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toBe("37")
    expect(handler).not.toHaveBeenCalled()
    expect(consumeRateLimit).toHaveBeenCalledWith(expect.objectContaining({
      scope: "resume-download",
      dimension: "ip",
      identifier: "203.0.113.10",
    }))
  })

  it("uses separate IP and visitor buckets when the visitor cookie exists", async () => {
    consumeRateLimit.mockResolvedValue({
      isLimited: false,
      limit: 10,
      remaining: 9,
      retryAfterSeconds: 60,
    })
    const handler = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    const limitedHandler = withRateLimit(
      handler,
      { visitor: 10, ip: 30 },
      "blog-like",
    )

    const response = await limitedHandler(
      new Request("http://localhost:5173/api/blog/posts/post/like", {
        headers: {
          cookie: "visitor_id=visitor-id",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      undefined,
    )

    expect(response.status).toBe(204)
    expect(response.headers.get("RateLimit-Remaining")).toBe("9")
    expect(consumeRateLimit).toHaveBeenCalledTimes(2)
    expect(consumeRateLimit).toHaveBeenCalledWith(expect.objectContaining({
      dimension: "visitor",
      identifier: "visitor-id",
    }))
  })
})
