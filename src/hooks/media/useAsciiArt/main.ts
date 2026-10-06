import { useEffect, useRef, useState } from 'react'

import { imageToAscii, mergeAsciiRegion, type AsciiRow } from '../../../utils/ascii'

import type { AsciiArtInput, AsciiArtOutput } from './types'

/**
 * @hook useAsciiArt
 * @description Loads an image off-screen and converts it into a character grid. This is the single
 * entry point for the ASCII rendering used across the site: components decide size and placement,
 * the conversion itself lives here and in utils/ascii.
 *
 * @param {AsciiArtInput} input - Image URL and the horizontal resolution of the grid
 *
 * @output {AsciiRow[] | null} rows - Character grid, null until the image is decoded
 *
 * @returns {AsciiArtOutput} Object exposing rows
 *
 * @sideEffects
 * - Decodes the image and samples it through an off-screen canvas on mount
 *
 * @example
 * const ascii = useAsciiArt({ src: profileImage, columns: 84 })
 */
export const useAsciiArt = (input: AsciiArtInput): AsciiArtOutput => {
  const { src, columns, rows: fixedRows, stableSrc, morphRegion, palette = "duotone" } = input
  // #region States
  const [rows, setRows] = useState<AsciiRow[] | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const cachedRows = useRef(new Map<string, AsciiRow[]>())

  // #endregion

  // #region Effects
  useEffect(() => {
    let active = true

    const loadRows = async (imageSrc: string) => {
      const cacheKey = `${imageSrc}:${columns}:${fixedRows ?? "auto"}:${palette}`
      const cached = cachedRows.current.get(cacheKey)
      if (cached) return cached

      const image = new Image()
      image.crossOrigin = "anonymous"
      image.src = imageSrc
      // The canvas must sample a decoded bitmap, especially on the first hover.
      await image.decode()
      const converted = imageToAscii(image, columns, fixedRows, palette)
      cachedRows.current.set(cacheKey, converted)
      return converted
    }

    Promise.all([
      loadRows(src),
      stableSrc && morphRegion && stableSrc !== src ? loadRows(stableSrc) : Promise.resolve(null),
    ])
      .then(([nextRows, stableRows]) => {
        if (!active) return

        setRows(stableRows && morphRegion
          ? mergeAsciiRegion(stableRows, nextRows, morphRegion)
          : nextRows)
        setSource(src)
      })
      .catch(() => {
        // Keep the current art visible if a replacement cannot be decoded.
      })

    return () => {
      active = false
    }
  }, [src, columns, fixedRows, stableSrc, morphRegion, palette])

  // #endregion

  return { rows, source }
}
