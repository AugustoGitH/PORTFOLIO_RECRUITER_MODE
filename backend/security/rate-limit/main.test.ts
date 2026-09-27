import { beforeEach, describe, expect, it, vi } from "vitest"

const createIndex = vi.fn().mockResolvedValue("index")
const findOneAndUpdate = vi.fn()
const find = vi.fn()
const deleteOne = vi.fn()
const collection = {
  createIndex,
  findOneAndUpdate,
  find,
  deleteOne,
}

vi.mock("@backend/libs/db/mongo", () => ({
  getMongoDb: vi.fn().mockResolvedValue({
    collection: vi.fn(() => collection),
  }),
}))

const { combineRateLimits, consumeRateLimit } = await import("./main")

describe("persistent rate limit", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("atomically consumes a scoped bucket and reports remaining attempts", async () => {
    findOneAndUpdate.mockResolvedValue({
      count: 3,
      expiresAt: new Date(Date.now() + 60_000),
    })

    const result = await consumeRateLimit({
      scope: "feedback-submit",
      dimension: "ip",
      identifier: "203.0.113.10",
      limit: 5,
      windowMs: 60_000,
    })

    expect(result).toMatchObject({
      isLimited: false,
      limit: 5,
      remaining: 2,
    })
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      {
        scope: "feedback-submit",
        dimension: "ip",
        identifier: "203.0.113.10",
      },
      expect.any(Array),
      { upsert: true, returnDocument: "after" },
    )
  })

  it("marks attempts over the limit as blocked", async () => {
    findOneAndUpdate.mockResolvedValue({
      count: 6,
      expiresAt: new Date(Date.now() + 60_000),
    })

    await expect(consumeRateLimit({
      scope: "feedback-submit",
      dimension: "visitor",
      identifier: "visitor-id",
      limit: 5,
      windowMs: 60_000,
    })).resolves.toMatchObject({
      isLimited: true,
      remaining: 0,
    })
  })

  it("combines independent dimensions using the strictest result", () => {
    expect(combineRateLimits(
      { isLimited: false, limit: 10, remaining: 6, retryAfterSeconds: 40 },
      { isLimited: true, limit: 3, remaining: 0, retryAfterSeconds: 25 },
    )).toEqual({
      isLimited: true,
      limit: 3,
      remaining: 0,
      retryAfterSeconds: 25,
    })
  })
})
