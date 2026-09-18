import { useEffect, useState } from "react"
import { cn } from "../../../utils/tailwind"
import type { DisplayProps } from "./types"
import { DigitReel } from "./components"


/**
 * Numeric display with a rolling "counter" effect. On mount the reels start at
 * zero and roll up to `value`; later changes roll each digit to its new place.
 */
export const Display = (props: DisplayProps) => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    // Flip on the next frame so the reels animate from 0 to the target value.
    const frame = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const digits = String(Math.trunc(Math.abs(props.value))).split("")

  return (
    <span style={props.style} className={cn("inline-flex tabular-nums leading-none", props.className)}>
      {props.value < 0 && <span>-</span>}
      {digits.map((digit, index) => (
        <DigitReel
          key={digits.length - index}
          digit={active ? Number(digit) : 0}
          duration={props.duration ?? 1000}
          delay={index * (props.step ?? 60)}
        />
      ))}
    </span>
  )
}
