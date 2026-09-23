import type { AsciiRow, AsciiTone } from "./types"

export type AsciiRegion = {
  /** Fractions of the image width and height, from 0 to 1. */
  left: number
  right: number
  top: number
  bottom: number
}

type Cell = { char: string; tone: AsciiTone; color?: string }

const toCells = (row: AsciiRow): Cell[] =>
  row.flatMap((run) => Array.from(run.text, (char) => ({ char, tone: run.tone, color: run.color })))

const toRuns = (cells: Cell[]): AsciiRow => cells.reduce<AsciiRow>((runs, cell) => {
  const previous = runs[runs.length - 1]

  if (previous?.tone === cell.tone && previous.color === cell.color) previous.text += cell.char
  else runs.push({ text: cell.char, tone: cell.tone, color: cell.color })

  return runs
}, [])

/** Keep the first drawing untouched outside the area that is meant to react. */
export const mergeAsciiRegion = (base: AsciiRow[], variant: AsciiRow[], region: AsciiRegion): AsciiRow[] =>
  base.map((baseRow, rowIndex) => {
    const rowPosition = (rowIndex + 0.5) / base.length
    const variantRow = variant[rowIndex]

    if (rowPosition < region.top || rowPosition >= region.bottom || !variantRow) return baseRow

    const baseCells = toCells(baseRow)
    const variantCells = toCells(variantRow)
    const left = Math.floor(region.left * baseCells.length)
    const right = Math.ceil(region.right * baseCells.length)

    return toRuns(baseCells.map((cell, column) =>
      column >= left && column < right ? (variantCells[column] ?? cell) : cell,
    ))
  })
