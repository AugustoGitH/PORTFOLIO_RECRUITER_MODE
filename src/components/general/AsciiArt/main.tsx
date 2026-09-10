import { useAsciiArt, useAsciiReveal } from "../../../hooks/media"
import { useOnceInView } from "../../../hooks/observer"
import { cn } from "../../../utils/tailwind"
import { CHAR_ASPECT } from "../../../utils/ascii"
import type { AsciiArtProps } from "./types"

const DEFAULT_COLUMNS = 120
const DEFAULT_VARIANT = "decode"

const ACCENT = "text-ud-auxiliary-purple"
const TRANSITION = "transition-all duration-500 ease-out motion-reduce:transition-none"
// "inline-block" so transform actually applies (inline boxes ignore it); only needed on the
// cell an idle tick just touched, everything else stays a plain inline span.
const PULSE = "inline-block animate-glyph-pop motion-reduce:animate-none"

/**
 * Renders an image as a block of monospace characters, in the two tones of the palette:
 * solid masses in ud-neutral-999, mid tones and contours in ud-auxiliary-purple.
 *
 * The font size is derived from `width` instead of being set in CSS, because the block only
 * keeps the proportions of the source image while the glyph cell matches the aspect ratio the
 * grid was built with — which also requires the line height to stay at 1.
 *
 * The block assembles itself once, the first time it scrolls into view, following one of three
 * interchangeable strategies (`props.variant`, see useAsciiReveal) — all sharing the same
 * bottom-to-top wave timing, and all settling into the same subtle idle shimmer afterwards.
 */
export const AsciiArt = (props: AsciiArtProps) => {
  const columns = props.columns ?? DEFAULT_COLUMNS
  const variant = props.variant ?? DEFAULT_VARIANT
  const target = useAsciiArt({ src: props.src, columns })
  const { ref, inView } = useOnceInView<HTMLPreElement>()

  const fontSize = props.width / (columns * CHAR_ASPECT)
  const cell = { width: props.width / columns, height: fontSize }
  const ascii = useAsciiReveal({
    rows: target.rows,
    play: inView,
    variant,
    cell: variant === "converge" ? cell : undefined,
  })

  return (
    <pre
      ref={ref}
      role="img"
      aria-label={props.alt}
      style={{
        ...props.style,
        width: props.width,
        height: variant === "converge" ? (target.rows?.length ?? 0) * cell.height : undefined,
        fontSize,
        position: variant === "converge" ? "relative" : undefined,
      }}
      className={cn("m-0 font-mono leading-none select-none text-ud-neutral-999", props.className)}
    >
      {ascii.variant === "decode" && ascii.rows?.map((row, rowIndex) => (
        <span key={rowIndex} className="block">
          {row.map((run, runIndex) => (
            <span
              key={run.pulseId ?? runIndex}
              className={cn(run.tone === "accent" ? ACCENT : undefined, run.pulseId && PULSE)}
            >
              {run.text}
            </span>
          ))}
        </span>
      ))}

      {ascii.variant === "sweep" && ascii.rows?.map((row, rowIndex) => (
        <span
          key={rowIndex}
          className={cn("block", TRANSITION, ascii.revealed ? "translate-y-0 opacity-100" : "translate-y-[0.6em] opacity-0")}
          style={{ transitionDelay: `${ascii.rowDelay[rowIndex]}ms` }}
        >
          {row.map((run, runIndex) => (
            <span
              key={run.pulseId ?? runIndex}
              className={cn(run.tone === "accent" ? ACCENT : undefined, run.pulseId && PULSE)}
            >
              {run.text}
            </span>
          ))}
        </span>
      ))}

      {ascii.variant === "converge" && ascii.chars?.map((char) => (
        <span
          key={char.pulseId ?? char.key}
          className={cn(
            "absolute left-0 top-0",
            TRANSITION,
            char.tone === "accent" ? ACCENT : undefined,
            char.pulseId && "animate-glyph-pop motion-reduce:animate-none"
          )}
          style={{
            opacity: ascii.revealed ? 1 : 0,
            transitionDelay: `${char.delayMs}ms`,
            transform: ascii.revealed
              ? `translate(${char.finalX}px, ${char.finalY}px)`
              : `translate(${char.startX}px, ${char.startY}px) rotate(${char.startRotation}deg)`,
          }}
        >
          {char.char}
        </span>
      ))}
    </pre>
  )
}
