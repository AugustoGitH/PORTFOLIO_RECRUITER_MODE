import { describe, expect, it } from "vitest"
import { mergeAsciiRegion } from "./mergeAsciiRegion"
import type { AsciiRow } from "./types"

describe("mergeAsciiRegion", () => {
  it("changes the face area while keeping the rest of the drawing identical", () => {
    const base: AsciiRow[] = [
      [{ text: "ABCD", tone: "ink" }],
      [{ text: "ABCD", tone: "ink" }],
      [{ text: "TABLE", tone: "accent" }],
    ]
    const variant: AsciiRow[] = [
      [{ text: "wxyz", tone: "accent" }],
      [{ text: "wxyz", tone: "accent" }],
      [{ text: "OTHER", tone: "ink" }],
    ]

    const merged = mergeAsciiRegion(base, variant, {
      left: 0.25,
      right: 0.75,
      top: 0.25,
      bottom: 0.75,
    })

    expect(merged[0]).toBe(base[0])
    expect(merged[1]).toEqual([
      { text: "A", tone: "ink" },
      { text: "xy", tone: "accent" },
      { text: "D", tone: "ink" },
    ])
    expect(merged[2]).toBe(base[2])
  })
})
