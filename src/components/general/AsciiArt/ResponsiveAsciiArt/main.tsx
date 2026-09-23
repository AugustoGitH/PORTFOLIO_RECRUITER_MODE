import { useEffect, useRef, useState } from "react"
import { cn } from "../../../../utils/tailwind"
import { AsciiArt } from "../main"
import type { ResponsiveAsciiArtProps } from "./types"

export const ResponsiveAsciiArt = ({ initialWidth, wrapperClassName, ...props }: ResponsiveAsciiArtProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initialWidth)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width)
      if (nextWidth > 0) setWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth)
    })

    observer.observe(wrapper)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} className={cn("w-full", wrapperClassName)}>
      <AsciiArt {...props} width={width} baseWidth={width} />
    </div>
  )
}
