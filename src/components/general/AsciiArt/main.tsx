import { useEffect, useState } from "react"
import { useAsciiArt, useAsciiReveal } from "../../../hooks/media"
import { useOnceInView } from "../../../hooks/observer"
import { cn } from "../../../utils/tailwind"
import { CHAR_ASPECT, type AsciiRow } from "../../../utils/ascii"
import type { AsciiArtProps } from "./types"

const DEFAULT_COLUMNS = 120
const DEFAULT_VARIANT = "decode"

const ACCENT = "text-ud-auxiliary-purple"
const TRANSITION = "transition-all duration-500 ease-out motion-reduce:transition-none"
// "inline-block" so transform actually applies (inline boxes ignore it); only needed on the
// cell an idle tick just touched, everything else stays a plain inline span.
const PULSE = "inline-block animate-glyph-pop motion-reduce:animate-none"
type ArtLayout = {
  width: number
  rows?: number
  overflowAlign: "left" | "center" | "right"
}

const AsciiRows = ({ rows }: { rows: AsciiRow[] | null }) => rows?.map((row, rowIndex) => (
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
))

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
  const baseWidth = props.baseWidth ?? props.width
  const overflowAlign = props.overflowAlign ?? "right"
  const target = useAsciiArt({ src: props.src, columns, rows: props.rows })
  const { ref, inView } = useOnceInView<HTMLDivElement>()

  const [activeSource, setActiveSource] = useState(props.src)
  const [activeLayout, setActiveLayout] = useState<ArtLayout>({
    width: props.width,
    rows: props.rows,
    overflowAlign,
  })
  const [pendingLayout, setPendingLayout] = useState<ArtLayout | null>(null)

  const fontSize = activeLayout.width / (columns * CHAR_ASPECT)
  const baseFontSize = baseWidth / (columns * CHAR_ASPECT)
  const cell = { width: activeLayout.width / columns, height: fontSize }
  const ascii = useAsciiReveal({
    rows: target.rows,
    play: inView,
    variant,
    cell: variant === "converge" ? cell : undefined,
  })

  // Keep the current footprint while a replacement bitmap decodes. A geometry change waits one
  // committed frame before changing its CSS dimensions, letting the same ASCII grid morph while
  // width, height and glyph size interpolate instead of replacing the drawing on hover.
  if (target.source === props.src && activeSource !== props.src) {
    const changesGeometry = activeLayout.width !== props.width || activeLayout.rows !== props.rows

    setActiveSource(props.src)
    if (changesGeometry) setPendingLayout({ width: props.width, rows: props.rows, overflowAlign })
    else setActiveLayout({ width: props.width, rows: props.rows, overflowAlign })
  }

  useEffect(() => {
    if (!pendingLayout) return

    const frame = requestAnimationFrame(() => {
      setActiveLayout(pendingLayout)
      setPendingLayout(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [pendingLayout])

  const getHorizontalPosition = (layout: ArtLayout) => layout.overflowAlign === "left"
    ? { left: 0 }
    : layout.overflowAlign === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { right: 0 }

  const getArtStyle = (layout: ArtLayout) => {
    const layoutFontSize = layout.width / (columns * CHAR_ASPECT)

    return {
      ...props.style,
      ...getHorizontalPosition(layout),
      width: layout.width,
      minWidth: layout.width,
      maxWidth: layout.width,
      boxSizing: "border-box" as const,
      height: layout.rows ? layout.rows * layoutFontSize : variant === "converge" ? (target.rows?.length ?? 0) * layoutFontSize : undefined,
      fontSize: layoutFontSize,
      position: "absolute" as const,
    }
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-label={props.alt}
      style={{
        width: baseWidth,
        minWidth: baseWidth,
        maxWidth: baseWidth,
        flexShrink: 0,
        boxSizing: "border-box",
        height: props.baseRows ? props.baseRows * baseFontSize : props.rows ? props.rows * baseFontSize : variant === "converge" ? (target.rows?.length ?? 0) * baseFontSize : undefined,
        position: "relative",
      }}
      className="shrink-0"
    >
      <pre
        aria-hidden="true"
        style={getArtStyle(activeLayout)}
        className={cn("pointer-events-none m-0 font-mono leading-none select-none text-ud-neutral-999 transition-[width,height,font-size] duration-[1140ms] ease-out motion-reduce:transition-none", props.className)}
      >
      {ascii.variant === "decode" && <AsciiRows rows={ascii.rows} />}

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
    </div>
  )
}
