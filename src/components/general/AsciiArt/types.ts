import type { AsciiRevealVariant } from "../../../hooks/media/useAsciiReveal"
import type { PropsWithClassName, PropsWithStyle } from "../../../utils/types"

export type AsciiArtProps = PropsWithClassName<PropsWithStyle<{
  /** Image to characterize. Import the asset so the URL survives the production build. */
  src: string
  /** Accessible description, replacing the alt of the image it stands in for. */
  alt: string
  /** Rendered width in px. The font size is derived from it so the block keeps this footprint. */
  width: number
  /** Width reserved in the surrounding layout. Defaults to `width`; use a smaller base width when
   * a slide intentionally overflows its original footprint. */
  baseWidth?: number
  /** Number of rows reserved by the original slide. Defaults to `rows`. */
  baseRows?: number
  /** Horizontal resolution of the character grid: more columns, more detail, more elements.
   * @default 120 */
  columns?: number
  /** Fixed number of grid rows. Use it for a changing `src` to preserve the exact footprint of
   * the art while its source is morphing. */
  rows?: number
  /** Edge of the base footprint kept fixed when the visual width overflows it.
   * @default "right" */
  overflowAlign?: "left" | "center" | "right"
  /** How the block assembles itself the first time it scrolls into view. "converge" renders one
   * element per character and is noticeably heavier — reserve it for a single hero-sized piece.
   * @default "decode" */
  variant?: AsciiRevealVariant
}>>

export type ArtLayout = {
  width: number
  rows?: number
  overflowAlign: "left" | "center" | "right"
}

export type ArtState = {
  source: string
  layout: ArtLayout
  pendingLayout: ArtLayout | null
}