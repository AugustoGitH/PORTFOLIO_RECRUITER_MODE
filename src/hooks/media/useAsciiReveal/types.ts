import type { AsciiRow, AsciiTone } from "../../../utils/ascii"

/**
 * - "decode": every non-blank cell flickers through random glyphs and locks into its final
 *   glyph, bottom row first. Cheapest — only run strings mutate, nothing moves.
 * - "sweep": each row slides up into place and fades in, bottom row first. CSS-driven
 *   (transform/opacity), no per-frame JS.
 * - "converge": every character starts scattered around the block and flies to its final
 *   cell, bottom rows first. One element per character — the priciest of the three, only
 *   worth it for a hero-sized piece.
 */
export type AsciiRevealVariant = "converge" | "sweep" | "decode"

export type AsciiRevealInput = {
  /** Final character grid to reveal. Null while the source image hasn't been decoded yet. */
  rows: AsciiRow[] | null
  /** Set to true to start the reveal. Flipping it back to false has no effect once started. */
  play: boolean
  variant: AsciiRevealVariant
  /** Cell size in px. Required by "converge" to place each character; ignored otherwise. */
  cell?: { width: number; height: number }
}

/** A single positioned character, used by the "converge" variant. */
export type AsciiChar = {
  key: string
  char: string
  tone: AsciiTone
  finalX: number
  finalY: number
  startX: number
  startY: number
  startRotation: number
  delayMs: number
  /** Set only for the tick an idle shimmer just touched this character. Always a fresh number —
   * see AsciiRun.pulseId. */
  pulseId?: number
}

export type AsciiRevealOutput =
  | { variant: "decode"; rows: AsciiRow[] | null }
  | { variant: "sweep"; rows: AsciiRow[] | null; revealed: boolean; rowDelay: number[] }
  | { variant: "converge"; chars: AsciiChar[] | null; revealed: boolean }
