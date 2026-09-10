import type { AsciiRow } from "../../../utils/ascii"

export type AsciiArtInput = {
  /** Image URL. Import the asset so the URL also resolves in a production build. */
  src: string
  /** Horizontal resolution of the character grid. */
  columns: number
}

export type AsciiArtOutput = {
  /** Character grid, or null while the image has not been decoded yet. */
  rows: AsciiRow[] | null
}
