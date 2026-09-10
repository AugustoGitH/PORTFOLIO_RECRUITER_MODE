/** Which of the two palette colors a stretch of characters is painted with. */
export type AsciiTone = "ink" | "accent" | "blank"

/** Consecutive characters of a row that share the same tone, so a row renders as a
 * handful of elements instead of one per character. */
export type AsciiRun = {
  text: string
  tone: AsciiTone
  /** Set only for the tiny, isolated run an idle shimmer tick just touched. Always a fresh
   * number, so using it as the React key forces a remount and restarts its CSS pop animation. */
  pulseId?: number
}

export type AsciiRow = AsciiRun[]
