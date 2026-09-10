import type { PropsWithClassName, PropsWithStyle } from "../../../utils/types"

export type DisplayProps = PropsWithClassName<PropsWithStyle<{
  /** Target number. Only the integer part is shown (rolls through the digits). */
  value: number
  /** Roll duration of each digit, in ms. @default 1000 */
  duration?: number
  /** Delay added per digit position, in ms, for a cascading roll. @default 60 */
  step?: number
}>>

export type DigitReelProps = {
  digit: number
  duration: number
  delay: number
}
