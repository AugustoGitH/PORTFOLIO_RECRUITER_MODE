import { describe, expect, it } from "vitest"
import { createAsciiArtProps } from "./createAsciiArtProps"

describe("createAsciiArtProps", () => {
  it("preserves the base dimensions when the selected state only changes the source", () => {
    expect(createAsciiArtProps({
      baseRows: 78,
      baseWidth: 380,
      columns: 130,
      width: 380,
      states: [
        { active: true, art: { src: "/hover.png", alt: "Hover image" } },
        { active: false, art: { src: "/default.png", alt: "Default image" } },
      ],
    })).toMatchObject({
      alt: "Hover image",
      baseRows: 78,
      baseWidth: 380,
      columns: 130,
      rows: 78,
      src: "/hover.png",
      width: 380,
    })
  })

  it("lets a selected state override the base geometry", () => {
    expect(createAsciiArtProps({
      baseRows: 78,
      baseWidth: 300,
      columns: 110,
      states: [
        { active: true, art: { src: "/recruiter.png", alt: "Recruiter image", rows: 72, width: 360 } },
      ],
    })).toMatchObject({ rows: 72, width: 360 })
  })
})
