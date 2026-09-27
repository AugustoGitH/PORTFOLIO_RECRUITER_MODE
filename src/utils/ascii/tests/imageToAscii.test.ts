import { afterEach, describe, expect, it, vi } from "vitest"
import { imageToAscii } from "../imageToAscii"

afterEach(() => vi.unstubAllGlobals())

describe("imageToAscii source palette", () => {
  it("keeps sampled colors and leaves transparent pixels empty", () => {
    const pixels = new Uint8ClampedArray([
      245, 205, 185, 255,
      255, 0, 0, 0,
    ])

    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          drawImage: () => undefined,
          getImageData: () => ({ data: pixels }),
        }),
      }),
    })

    const image = { naturalWidth: 2, naturalHeight: 1 } as HTMLImageElement
    const rows = imageToAscii(image, 2, 1, "source")

    expect(rows).toEqual([[
      { text: "█", tone: "ink", color: "rgb(240 204 180 / 1)" },
      { text: " ", tone: "blank", color: undefined },
    ]])
  })
})
