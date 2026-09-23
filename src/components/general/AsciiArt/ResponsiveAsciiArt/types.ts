import type { AsciiArtProps } from "../types"

export type ResponsiveAsciiArtProps = Omit<AsciiArtProps, "baseWidth" | "width"> & {
  /** Width used until the wrapper can be measured in the browser. */
  initialWidth: number
  /** Layout classes for the responsive slot that owns the artwork width. */
  wrapperClassName?: string
}
