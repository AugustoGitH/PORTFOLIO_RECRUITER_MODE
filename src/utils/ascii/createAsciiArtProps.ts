import type { AsciiArtProps } from "@/components/general/AsciiArt"
import type { CreateAsciiArtOptions } from "./types"

export const createAsciiArtProps = (options: CreateAsciiArtOptions): AsciiArtProps => {
  const { states, ...artOptions } = options
  const selectedState = states.find((state) => state.active)?.art ?? states[0].art

  return {
    ...artOptions,
    alt: selectedState.alt,
    src: selectedState.src,
    width: selectedState.width ?? options.width ?? options.baseWidth,
    rows: selectedState.rows ?? options.baseRows,
  }
}
