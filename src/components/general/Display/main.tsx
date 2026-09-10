import { useEffect, useState } from "react"
import { cn } from "../../../utils/tailwind"
import type { DigitReelProps, DisplayProps } from "./types"

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * A single 0-9 reel. The inner column is translated vertically so the target
 * digit sits in the 1em viewport; the CSS transition makes it roll through the
 * digits in between (up when the target grows, down when it shrinks).
 */
const DigitReel = (props: DigitReelProps) => {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-bottom leading-none">
      <span
        className="flex flex-col will-change-transform transition-transform ease-out"
        style={{
          transform: `translateY(-${props.digit}em)`,
          transitionDuration: `${props.duration}ms`,
          transitionDelay: `${props.delay}ms`,
        }}
      >
        {DIGITS.map(digit => (
          <span key={digit} className="h-[1em] leading-none">{digit}</span>
        ))}
      </span>
    </span>
  )
}

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
