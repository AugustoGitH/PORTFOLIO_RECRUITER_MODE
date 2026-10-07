import { BLANK_INK, CHAR_ASPECT, RAMP, SOLID_INK } from "@/constants/ascii/config"
import type { AsciiRow, AsciiRun, AsciiTone } from "./types"

const SOURCE_COLOR_STEP = 12
const SOURCE_OPACITY_STEPS = 16
const SOURCE_QUADRANT_ALPHA = 0.08

const QUADRANT_GLYPHS = [
  " ", "▘", "▝", "▀",
  "▖", "▌", "▞", "▛",
  "▗", "▚", "▐", "▜",
  "▄", "▙", "▟", "█",
] as const

type SampleBounds = {
  left: number
  top: number
  right: number
  bottom: number
}

type SourceSample = {
  red: number
  green: number
  blue: number
  alpha: number
  area: number
}

/** Fraction of the cell covered by ink, 0 for untouched background and 1 for solid black. */
const inkCoverage = (
  pixels: Uint8ClampedArray,
  width: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
) => {
  let total = 0
  let samples = 0

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      const index = (y * width + x) * 4
      // Composite over white so transparent PNGs sample as background, not as black.
      const alpha = pixels[index + 3] / 255
      const red = pixels[index] * alpha + 255 * (1 - alpha)
      const green = pixels[index + 1] * alpha + 255 * (1 - alpha)
      const blue = pixels[index + 2] * alpha + 255 * (1 - alpha)

      total += 1 - (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
      samples++
    }
  }

  return samples ? total / samples : 0
}

/** Sample a cell in premultiplied alpha so transparent edge pixels keep their color. */
const sampleSource = (
  pixels: Uint8ClampedArray,
  width: number,
  bounds: SampleBounds,
): SourceSample => {
  let red = 0
  let green = 0
  let blue = 0
  let alpha = 0
  let area = 0

  for (let y = Math.floor(bounds.top); y < Math.ceil(bounds.bottom); y++) {
    const verticalCoverage = Math.max(0, Math.min(y + 1, bounds.bottom) - Math.max(y, bounds.top))

    for (let x = Math.floor(bounds.left); x < Math.ceil(bounds.right); x++) {
      const horizontalCoverage = Math.max(0, Math.min(x + 1, bounds.right) - Math.max(x, bounds.left))
      const pixelArea = horizontalCoverage * verticalCoverage
      const index = (y * width + x) * 4
      const opacity = pixels[index + 3] / 255
      red += pixels[index] * opacity * pixelArea
      green += pixels[index + 1] * opacity * pixelArea
      blue += pixels[index + 2] * opacity * pixelArea
      alpha += opacity * pixelArea
      area += pixelArea
    }
  }

  return { red, green, blue, alpha, area }
}

const sourceColor = (sample: SourceSample) => {
  const { red, green, blue, alpha } = sample
  const opacity = sample.area ? Math.round(alpha / sample.area * SOURCE_OPACITY_STEPS) / SOURCE_OPACITY_STEPS : 0
  if (!alpha || opacity === 0) return null

  const quantize = (value: number) => Math.min(255, Math.round(value / SOURCE_COLOR_STEP) * SOURCE_COLOR_STEP)
  return `rgb(${quantize(red / alpha)} ${quantize(green / alpha)} ${quantize(blue / alpha)} / ${opacity})`
}

/**
 * Represents the silhouette of a source-colored cell with four Unicode quadrants. Small artwork
 * gets twice the effective edge resolution in each direction without increasing the DOM size or
 * shrinking the glyphs further. The bit order follows top-left, top-right, bottom-left,
 * bottom-right, matching QUADRANT_GLYPHS.
 */
const sourceCell = (
  pixels: Uint8ClampedArray,
  width: number,
  bounds: SampleBounds,
) => {
  const middleX = (bounds.left + bounds.right) / 2
  const middleY = (bounds.top + bounds.bottom) / 2
  const quadrants: SampleBounds[] = [
    { left: bounds.left, top: bounds.top, right: middleX, bottom: middleY },
    { left: middleX, top: bounds.top, right: bounds.right, bottom: middleY },
    { left: bounds.left, top: middleY, right: middleX, bottom: bounds.bottom },
    { left: middleX, top: middleY, right: bounds.right, bottom: bounds.bottom },
  ]

  let mask = 0
  const visibleSample: SourceSample = {
    red: 0,
    green: 0,
    blue: 0,
    alpha: 0,
    area: 0,
  }

  quadrants.forEach((quadrant, index) => {
    const sample = sampleSource(pixels, width, quadrant)
    const opacity = sample.area ? sample.alpha / sample.area : 0
    if (opacity < SOURCE_QUADRANT_ALPHA) return

    mask |= 1 << index
    visibleSample.red += sample.red
    visibleSample.green += sample.green
    visibleSample.blue += sample.blue
    visibleSample.alpha += sample.alpha
    visibleSample.area += sample.area
  })

  if (!mask) return null

  return {
    character: QUADRANT_GLYPHS[mask],
    color: sourceColor(visibleSample),
  }
}

/**
 * Converts an already-decoded image into a grid of characters, grouped into runs of
 * the same tone.
 *
 * Each cell averages every source pixel it covers rather than relying on the canvas
 * downscaler: line art has strokes thinner than a cell, and averaging is what turns a
 * one-pixel stroke into a mid-density glyph instead of dropping it.
 */
export const imageToAscii = (image: HTMLImageElement, columns: number, fixedRows?: number, palette: "duotone" | "source" = "duotone"): AsciiRow[] => {
  const width = image.naturalWidth
  const height = image.naturalHeight

  if (!width || !height) return []

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d", { willReadFrequently: true })

  if (!context) return []

  context.drawImage(image, 0, 0)

  const pixels = context.getImageData(0, 0, width, height).data
  const rows = fixedRows ?? Math.max(1, Math.round(columns * (height / width) * CHAR_ASPECT))
  const cellWidth = width / columns
  const cellHeight = height / rows
  const grid: AsciiRow[] = []

  for (let row = 0; row < rows; row++) {
    const runs: AsciiRun[] = []
    const top = Math.floor(row * cellHeight)
    const bottom = Math.min(height, Math.ceil((row + 1) * cellHeight))

    for (let column = 0; column < columns; column++) {
      const left = Math.floor(column * cellWidth)
      const right = Math.min(width, Math.ceil((column + 1) * cellWidth))
      let character = " "
      let tone: AsciiTone = "blank"
      let color: string | undefined

      if (palette === "source") {
        const source = sourceCell(pixels, width, {
          left: column * cellWidth,
          top: row * cellHeight,
          right: (column + 1) * cellWidth,
          bottom: (row + 1) * cellHeight,
        })
        color = source?.color ?? undefined
        if (source && color) {
          character = source.character
          tone = "ink"
        }
      } else {
        const coverage = inkCoverage(pixels, width, left, top, right, bottom)

        if (coverage > BLANK_INK) {
          const density = Math.min(1, coverage / SOLID_INK)
          const index = Math.min(RAMP.length - 1, Math.floor((1 - density) * RAMP.length))

          character = RAMP[index]
          tone = coverage >= SOLID_INK ? "ink" : "accent"
        }
      }

      const previous = runs[runs.length - 1]

      if (previous && previous.tone === tone && previous.color === color) previous.text += character
      else runs.push({ text: character, tone, color })
    }

    grid.push(runs)
  }

  return grid
}
