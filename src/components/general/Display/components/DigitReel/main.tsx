import { DIGITS } from "../../constants"
import { DigitReelProps } from "./types"


/**
 * A single 0-9 reel. The inner column is translated vertically so the target
 * digit sits in the 1em viewport; the CSS transition makes it roll through the
 * digits in between (up when the target grows, down when it shrinks).
 */
export const DigitReel = (props: DigitReelProps) => {
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