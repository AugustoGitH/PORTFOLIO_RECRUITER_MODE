import type { AsciiRow } from "../../../utils/ascii"

export type AsciiArtInput = {
  /** Image URL. Import the asset so the URL also resolves in a production build. */
  src: string
  /** Horizontal resolution of the character grid. */
  columns: number
  /** Fixed vertical resolution. When supplied, changing sources cannot change the block height. */
  rows?: number
}

export type AsciiArtOutput = {
  /** Character grid, or null while the image has not been decoded yet. */
  rows: AsciiRow[] | null
  /** Source that produced `rows`; it remains unchanged while a replacement loads. */
  source: string | null
}
