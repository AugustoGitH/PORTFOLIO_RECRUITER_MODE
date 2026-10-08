import { describe, expect, it } from "vitest"
import { pickToolbarGroups, findShortcutAction } from "./components/MarkdownToolbar/actions"
import { insertLineBreak } from "./utils"

describe("insertLineBreak", () => {
  it("inserts a hard break after the selection and collapses the cursor after it", () => {
    expect(insertLineBreak({ value: "ab cd", start: 0, end: 2 })).toEqual({ value: "ab\\\n cd", start: 4, end: 4 })
  })
})

describe("pickToolbarGroups", () => {
  it("keeps only the requested actions, in canonical order, dropping empty groups", () => {
    const groups = pickToolbarGroups(["italic", "break", "bold"])

    expect(groups.map((group) => group.map((action) => action.id))).toEqual([["break", "bold", "italic"]])
  })

  it("returns every group when no ids are given", () => {
    expect(pickToolbarGroups().length).toBeGreaterThan(1)
  })

  it("disables shortcuts of actions that are not in the toolbar", () => {
    expect(findShortcutAction("b", ["bold"])?.id).toBe("bold")
    expect(findShortcutAction("k", ["bold"])).toBeUndefined()
  })
})
