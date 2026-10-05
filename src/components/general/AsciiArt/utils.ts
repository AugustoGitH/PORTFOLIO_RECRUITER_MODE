import type { ArtLayout } from "./types"

export const getHorizontalPosition = (layout: ArtLayout) => layout.overflowAlign === "left"
  ? { left: 0 }
  : layout.overflowAlign === "center"
    ? { left: "50%", transform: "translateX(-50%)" }
    : { right: 0 }

export const getAsciiRunKey = (runIndex: number, pulseId?: number) =>
  pulseId === undefined ? `run-${runIndex}` : `run-${runIndex}-pulse-${pulseId}`
