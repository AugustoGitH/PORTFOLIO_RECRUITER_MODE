import { describe, expect, it } from "vitest"
import { ObjectId } from "mongodb"
import { selectRecommendations } from "./main"
import type { DeveloperRecommendation } from "@backend/developer-recommendations/models"

const profile = (overrides: Partial<DeveloperRecommendation>): DeveloperRecommendation => ({
  _id: new ObjectId(), slug: "profile", status: "published", displayName: "Alex", headline: "Developer", seniority: "mid-level", roleKinds: ["frontend"], skills: ["react"], contact: { label: "Contact", url: "https://example.com" }, editorialPriority: 0, consent: { grantedAt: new Date(), confirmedAt: new Date(), version: "v1" }, createdAt: new Date(), updatedAt: new Date(), ...overrides,
})

describe("selectRecommendations", () => {
  it("returns no profile without an explicit area", () => {
    expect(selectRecommendations([profile({})], { roles: [] })).toEqual([])
  })

  it("excludes non-published profiles and requires one matching area", () => {
    const result = selectRecommendations([profile({ status: "draft" }), profile({ roleKinds: ["backend"] })], { roles: ["frontend"] })
    expect(result).toEqual([])
  })

  it("sorts stable matches by areas, seniority, priority and name", () => {
    const result = selectRecommendations([
      profile({ displayName: "Zoe", roleKinds: ["frontend"], editorialPriority: 10 }),
      profile({ displayName: "Bia", roleKinds: ["frontend", "backend"], editorialPriority: 0 }),
      profile({ displayName: "Ana", roleKinds: ["frontend"], seniority: "mid-level", editorialPriority: 0 }),
      profile({ displayName: "Caio", roleKinds: ["frontend"], seniority: "senior", editorialPriority: 100 }),
    ], { roles: ["frontend", "backend"], seniority: "mid-level" })

    expect(result.map(({ profile: item }) => item.displayName)).toEqual(["Bia", "Zoe", "Ana"])
  })
})
