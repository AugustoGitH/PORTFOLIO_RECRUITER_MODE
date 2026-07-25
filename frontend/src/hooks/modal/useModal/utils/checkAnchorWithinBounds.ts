import type { AnchorBoundsResult, CheckAnchorWithinBoundsOptions } from '../types'

export const checkAnchorWithinBounds = (
  options: CheckAnchorWithinBoundsOptions
): AnchorBoundsResult => {
  // Check if anchor has scrolled outside the wrapper boundaries
  const isOutsideTop = options.anchorRect.bottom < options.wrapperRect.top
  const isOutsideBottom = options.anchorRect.top > options.wrapperRect.bottom
  const isOutsideLeft = options.anchorRect.right < options.wrapperRect.left
  const isOutsideRight = options.anchorRect.left > options.wrapperRect.right

  return {
    isOutside:
      isOutsideTop || isOutsideBottom || isOutsideLeft || isOutsideRight,
    details: {
      isOutsideTop,
      isOutsideBottom,
      isOutsideLeft,
      isOutsideRight,
    },
  }
}
