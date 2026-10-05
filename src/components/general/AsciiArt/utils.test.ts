import { describe, expect, it } from "vitest"

import { getAsciiRunKey } from "./utils"

describe("getAsciiRunKey", () => {
  it("keeps stable and pulsing sibling keys in separate namespaces", () => {
    expect(getAsciiRunKey(3)).not.toBe(getAsciiRunKey(4, 3))
  })

  it("changes the key when the same run receives a new pulse", () => {
    expect(getAsciiRunKey(3, 1)).not.toBe(getAsciiRunKey(3, 2))
  })
})
