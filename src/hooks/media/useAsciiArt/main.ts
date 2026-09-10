import { useEffect, useState } from 'react'

import { imageToAscii, type AsciiRow } from '../../../utils/ascii'

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
  // #region States
  const [rows, setRows] = useState<AsciiRow[] | null>(null)

  // #endregion

  // #region Effects
  useEffect(() => {
    let active = true
    const image = new Image()

    image.src = input.src

    // decode() resolves only once the bitmap is ready, which drawImage requires to
    // sample anything other than an empty canvas.
    image
      .decode()
      .then(() => {
        if (active) setRows(imageToAscii(image, input.columns))
      })
      .catch(() => {
        if (active) setRows(null)
      })

    return () => {
      active = false
    }
  }, [input.src, input.columns])

  // #endregion

  return { rows }
}
