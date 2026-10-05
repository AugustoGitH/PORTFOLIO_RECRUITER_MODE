import { describe, expect, it } from "vitest"
import { getActiveHeadingId } from "./utils"

const headings = [
  { id: "introducao", top: -320 },
  { id: "implementacao", top: 80 },
  { id: "conclusao", top: 540 },
]

describe("getActiveHeadingId", () => {
  it("keeps the first heading active before the article reaches the focus line", () => {
    expect(getActiveHeadingId({
      focusLine: 420,
      headings: headings.map((heading, index) => ({
        ...heading,
        top: 520 + index * 300,
      })),
      isAtPageEnd: false,
    })).toBe("introducao")
  })

  it("selects the section that contains the viewport focus line", () => {
    expect(getActiveHeadingId({
      focusLine: 420,
      headings,
      isAtPageEnd: false,
    })).toBe("implementacao")
  })

  it("distinguishes short sections that are visible in the same viewport", () => {
    expect(getActiveHeadingId({
      focusLine: 420,
      headings: [
        { id: "primeira", top: 60 },
        { id: "segunda", top: 220 },
        { id: "terceira", top: 390 },
        { id: "quarta", top: 560 },
      ],
      isAtPageEnd: false,
    })).toBe("terceira")
  })

  it("selects the final heading at the bottom of the page", () => {
    expect(getActiveHeadingId({
      focusLine: 420,
      headings,
      isAtPageEnd: true,
    })).toBe("conclusao")
  })

  it("returns null when the rendered article has no matching headings", () => {
    expect(getActiveHeadingId({
      focusLine: 420,
      headings: [],
      isAtPageEnd: false,
    })).toBeNull()
  })
})
