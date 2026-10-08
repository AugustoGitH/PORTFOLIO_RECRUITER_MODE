"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "../../../../utils/tailwind"
import { AsciiArt } from "../main"
import type { ResponsiveAsciiArtProps } from "./types"

export const ResponsiveAsciiArt = ({ initialWidth, wrapperClassName, ...props }: ResponsiveAsciiArtProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initialWidth)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(([entry]) => {
      // Leave one pixel per side for glyph advance rounding and text stroke. The art is
      // centered in that safe area, giving responsive artwork true contain semantics.
      const nextWidth = Math.max(1, Math.floor(entry.contentRect.width) - 2)
      if (nextWidth > 0) setWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth)
    })

    observer.observe(wrapper)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} className={cn("flex w-full min-w-0 justify-center overflow-hidden", wrapperClassName)}>
      <AsciiArt {...props} overflowAlign={props.overflowAlign ?? "center"} width={width} baseWidth={width} />
    </div>
  )
}
