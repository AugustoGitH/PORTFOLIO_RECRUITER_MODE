import { BLANK_INK, CHAR_ASPECT, RAMP, SOLID_INK } from "@/constants/ascii/config"
import type { AsciiRow, AsciiRun, AsciiTone } from "./types"


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

/**
 * Converts an already-decoded image into a grid of characters, grouped into runs of
 * the same tone.
 *
 * Each cell averages every source pixel it covers rather than relying on the canvas
 * downscaler: line art has strokes thinner than a cell, and averaging is what turns a
 * one-pixel stroke into a mid-density glyph instead of dropping it.
 */
export const imageToAscii = (image: HTMLImageElement, columns: number, fixedRows?: number): AsciiRow[] => {
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
      const coverage = inkCoverage(pixels, width, left, top, right, bottom)

      let character = " "
      let tone: AsciiTone = "blank"

      if (coverage > BLANK_INK) {
        const density = Math.min(1, coverage / SOLID_INK)
        const index = Math.min(RAMP.length - 1, Math.floor((1 - density) * RAMP.length))

        character = RAMP[index]
        tone = coverage >= SOLID_INK ? "ink" : "accent"
      }

      const previous = runs[runs.length - 1]

      if (previous && previous.tone === tone) previous.text += character
      else runs.push({ text: character, tone })
    }

    grid.push(runs)
  }

  return grid
}
