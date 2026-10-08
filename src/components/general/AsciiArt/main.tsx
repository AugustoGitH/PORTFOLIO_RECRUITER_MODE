"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { useAsciiArt, useAsciiReveal } from "../../../hooks/media"
import { useOnceInView } from "../../../hooks/observer"
import { cn } from "../../../utils/tailwind"
import type { ArtLayout, AsciiArtProps } from "./types"
import { CHAR_ASPECT } from "@/constants/ascii"
import { ACCENT, DEFAULT_COLUMNS, DEFAULT_VARIANT, FONT_FAMILY, PULSE, TRANSITION } from "./constants"
import { AsciiRows } from "./components"
import { getAsciiRunKey, getHorizontalPosition } from "./utils"
import { setDefaultProps } from "@/utils/preset"



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


export const AsciiArt = (_props: AsciiArtProps) => {
  const props = setDefaultProps(_props, {
    columns: DEFAULT_COLUMNS,
    variant: DEFAULT_VARIANT,
    baseWidth: _props.width,
    overflowAlign: "right",
  })

  const { ref, inView } = useOnceInView<HTMLDivElement>({
    rootMargin: "200px 0px",
    threshold: 0.01,
  })
  const target = useAsciiArt({
    enabled: inView,
    src: props.src,
    columns: props.columns,
    rows: props.rows,
    palette: props.palette,
    stableSrc: props.stableSrc,
    morphRegion: props.morphRegion,
  })
  // Spacing, in em, that brings the real glyph advance to CHAR_ASPECT. Block glyphs (█▓▒░) are
  // often not in the monospace font and fall back to another one, so rows would otherwise come out
  // wider than the block and overflow to the right.
  const [letterSpacing, setLetterSpacing] = useState<number | null>(null)

  const [activeSource, setActiveSource] = useState(props.src)
  const [activeLayout, setActiveLayout] = useState<ArtLayout>({
    width: props.width,
    rows: props.rows,
    overflowAlign: props.overflowAlign,
  })
  const [pendingLayout, setPendingLayout] = useState<ArtLayout | null>(null)

  const fontSize = activeLayout.width / (props.columns * CHAR_ASPECT)
  const baseFontSize = props.baseWidth / (props.columns * CHAR_ASPECT)
  const cell = { width: activeLayout.width / props.columns, height: fontSize }
  const fontFamily = props.style?.fontFamily ?? FONT_FAMILY

  const ascii = useAsciiReveal({
    rows: target.rows,
    play: inView,
    variant: props.variant,
    cell: props.variant === "converge" ? cell : undefined,
  })

  // Keep the current footprint while a replacement bitmap decodes. A geometry change waits one
  // committed frame so source and layout switch together instead of exposing an intermediate grid.
  const changesGeometry = activeLayout.width !== props.width || activeLayout.rows !== props.rows
  const geometryQueued = pendingLayout?.width === props.width && pendingLayout.rows === props.rows

  if (target.source === props.src && (activeSource !== props.src || (changesGeometry && !geometryQueued))) {
    setActiveSource(props.src)
    if (changesGeometry) setPendingLayout({ width: props.width, rows: props.rows, overflowAlign: props.overflowAlign })
    else setActiveLayout({ width: props.width, rows: props.rows, overflowAlign: props.overflowAlign })
  }

  const hasTextRows = ascii.variant !== "converge" && Boolean(ascii.rows?.length)

  useLayoutEffect(() => {
    const rowText = target.rows?.[0]?.map((run) => run.text).join("")
    if (letterSpacing !== null || !hasTextRows || !rowText) return

    const context = document.createElement("canvas").getContext("2d")
    if (!context) return

    context.font = `${props.style?.fontStyle ?? "normal"} ${props.style?.fontWeight ?? 400} ${fontSize}px ${fontFamily}`
    const rowWidth = context.measureText(rowText).width
    if (!rowWidth) return

    const frame = requestAnimationFrame(() => {
      setLetterSpacing(CHAR_ASPECT - rowWidth / rowText.length / fontSize)
    })

    return () => cancelAnimationFrame(frame)
  }, [fontFamily, fontSize, hasTextRows, letterSpacing, props.style?.fontStyle, props.style?.fontWeight, target.rows])

  useEffect(() => {
    if (!pendingLayout) return

    const frame = requestAnimationFrame(() => {
      setActiveLayout(pendingLayout)
      setPendingLayout(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [pendingLayout])


  const getArtStyle = (layout: ArtLayout) => {
    const layoutFontSize = layout.width / (props.columns * CHAR_ASPECT)

    return {
      // A slight stroke closes subpixel seams between adjacent glyph cells without hiding the
      // characters. This keeps the artwork continuous instead of exposing a visible square grid.
      WebkitTextStroke: "0.06em currentColor",
      ...props.style,
      fontFamily,
      ...getHorizontalPosition(layout),
      width: layout.width,
      minWidth: layout.width,
      maxWidth: layout.width,
      boxSizing: "border-box" as const,
      height: layout.rows ? layout.rows * layoutFontSize : props.variant === "converge" ? (target.rows?.length ?? 0) * layoutFontSize : undefined,
      fontSize: layoutFontSize,
      letterSpacing: letterSpacing === null ? undefined : `${letterSpacing}em`,
      position: "absolute" as const,
    }
  }

  return (
    <div
      ref={ref}
      role={props.alt ? "img" : undefined}
      aria-label={props.alt || undefined}
      aria-hidden={props.alt ? undefined : true}
      style={{
        width: props.baseWidth,
        minWidth: props.baseWidth,
        maxWidth: props.baseWidth,
        flexShrink: 0,
        boxSizing: "border-box",
        height: props.baseRows ? props.baseRows * baseFontSize : props.rows ? props.rows * baseFontSize : props.variant === "converge" ? (target.rows?.length ?? 0) * baseFontSize : undefined,
        position: "relative",
      }}
      className="shrink-0"
    >
      <pre
        aria-hidden="true"
        style={getArtStyle(activeLayout)}
        className={cn("pointer-events-none m-0 font-mono leading-none select-none text-ud-neutral-999", props.className)}
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
                key={getAsciiRunKey(runIndex, run.pulseId)}
                className={cn(run.tone === "accent" ? ACCENT : undefined, run.pulseId && PULSE)}
                style={run.color ? { color: run.color } : undefined}
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
              color: char.color,
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
