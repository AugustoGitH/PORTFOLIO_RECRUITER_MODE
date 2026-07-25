import type { CalculateHorizontalFallbackOptions, ModalPosition } from '../types'

export const calculateHorizontalFallback = (
  options: CalculateHorizontalFallbackOptions
): ModalPosition => {
  if (!options.config.horizontalFallback) return options.position

  const padding = options.config.minPadding || 16
  const adjustedPosition = { ...options.position }

  // Calculate actual left position
  const actualLeft =
    options.position.left === 'auto'
      ? options.viewport.width -
        (options.position.right === 'auto'
          ? 0
          : (options.position.right as number)) -
        options.modalRect.width
      : (options.position.left as number)

  // Check for horizontal overflow
  const overflowRight =
    actualLeft + options.modalRect.width > options.viewport.width - padding
  const overflowLeft = actualLeft < padding

  if (!overflowRight && !overflowLeft) return options.position

  // Apply horizontal fallbacks based on origin
  const offsetBottom = options.offset?.bottom || 0

  if (options.origin === 'right' && overflowRight) {
    // Fallback: position to left of anchor
    adjustedPosition.left = options.anchorRect.left - options.modalRect.width
    adjustedPosition.right = 'auto'

    // If still overflows left, center horizontally
    if (
      typeof adjustedPosition.left === 'number' &&
      adjustedPosition.left < padding
    ) {
      adjustedPosition.left =
        options.anchorRect.left +
        options.anchorRect.width / 2 -
        options.modalRect.width / 2
      if (adjustedPosition.left < padding) {
        adjustedPosition.left = padding
      }
    }
  } else if (options.origin === 'left' && overflowLeft) {
    // Fallback: position to right of anchor
    adjustedPosition.left = options.anchorRect.right
    adjustedPosition.right = 'auto'

    // If still overflows right, center horizontally
    if (
      typeof adjustedPosition.left === 'number' &&
      adjustedPosition.left + options.modalRect.width >
        options.viewport.width - padding
    ) {
      adjustedPosition.left =
        options.anchorRect.left +
        options.anchorRect.width / 2 -
        options.modalRect.width / 2
      if (
        adjustedPosition.left + options.modalRect.width >
        options.viewport.width - padding
      ) {
        adjustedPosition.left =
          options.viewport.width - options.modalRect.width - padding
      }
    }
  } else if (options.origin === 'center') {
    // For center origin, account for the translateX(-50%) transform
    // Calculate the effective left position after transform
    const centerLeft =
      (options.position.left as number) - options.modalRect.width / 2
    const centerRight = centerLeft + options.modalRect.width

    // Check if it overflows after centering
    if (centerRight > options.viewport.width - padding) {
      // Adjust to fit within options.viewport while maintaining center transform
      const maxCenterLeft =
        options.viewport.width - padding - options.modalRect.width / 2
      adjustedPosition.left = maxCenterLeft
    }
    if (centerLeft < padding) {
      // Adjust minimum position while maintaining center transform
      const minCenterLeft = padding + options.modalRect.width / 2
      adjustedPosition.left = minCenterLeft
    }
  } else if (options.origin === 'sub-right' && overflowRight) {
    // Fallback: position to left side of anchor
    adjustedPosition.left = options.anchorRect.left - options.modalRect.width
    adjustedPosition.right = 'auto'

    if (
      typeof adjustedPosition.left === 'number' &&
      adjustedPosition.left < padding
    ) {
      // Secondary fallback: position below anchor
      adjustedPosition.left = options.anchorRect.left
      adjustedPosition.top = options.anchorRect.bottom + offsetBottom
    }
  } else if (options.origin === 'sub-left' && overflowLeft) {
    // Fallback: position to right side of anchor
    adjustedPosition.left = options.anchorRect.right
    adjustedPosition.right = 'auto'

    if (
      typeof adjustedPosition.left === 'number' &&
      adjustedPosition.left + options.modalRect.width >
        options.viewport.width - padding
    ) {
      // Secondary fallback: position below anchor
      adjustedPosition.left = options.anchorRect.left
      adjustedPosition.top = options.anchorRect.bottom + offsetBottom
    }
  }

  return adjustedPosition
}
