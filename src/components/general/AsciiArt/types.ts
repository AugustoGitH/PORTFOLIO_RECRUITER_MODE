import type { AsciiRevealVariant } from "../../../hooks/media/useAsciiReveal"
import type { PropsWithClassName, PropsWithStyle } from "../../../utils/types"

export type AsciiArtProps = PropsWithClassName<PropsWithStyle<{
  /** Image to characterize. Import the asset so the URL survives the production build. */
  src: string
  /** Accessible description, replacing the alt of the image it stands in for. */
  alt: string
  /** Rendered width in px. The font size is derived from it so the block keeps this footprint. */
  width: number
  /** Horizontal resolution of the character grid: more columns, more detail, more elements.
   * @default 120 */
  columns?: number
  /** How the block assembles itself the first time it scrolls into view. "converge" renders one
   * element per character and is noticeably heavier — reserve it for a single hero-sized piece.
   * @default "decode" */
  variant?: AsciiRevealVariant
}>>
