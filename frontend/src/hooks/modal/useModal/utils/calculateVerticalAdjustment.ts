import type { CalculateVerticalAdjustmentOptions, ModalPosition } from '../types'

export const calculateVerticalAdjustment = (
  options: CalculateVerticalAdjustmentOptions
): ModalPosition => {
  if (!options.config.verticalAdjustment) return options.position

  const padding = options.config.minPadding || 16
  const adjustedPosition = { ...options.position }
  const offsetBottom = options.offset?.bottom || 0

  // Check vertical overflow
  const positionTop =
    typeof options.position.top === 'number' ? options.position.top : 0
  const overflowTop = positionTop < padding
  const overflowBottom =
    positionTop + options.modalRect.height > options.viewport.height - padding

  if (!overflowTop && !overflowBottom) return options.position

  // Handle vertical adjustments
  if (overflowBottom && !overflowTop) {
    // Try to position above anchor first
    const abovePosition =
      options.anchorRect.top - options.modalRect.height - Math.abs(offsetBottom)
    if (abovePosition >= padding) {
      adjustedPosition.top = abovePosition
    } else {
      // If can't fit above, adjust within options.viewport
      adjustedPosition.top =
        options.viewport.height - options.modalRect.height - padding
    }
  } else if (overflowTop && !overflowBottom) {
    // Position below anchor or adjust to fit
    const belowPosition = options.anchorRect.bottom + offsetBottom
    if (
      belowPosition + options.modalRect.height <=
      options.viewport.height - padding
    ) {
      adjustedPosition.top = belowPosition
    } else {
      adjustedPosition.top = padding
    }
  } else if (overflowTop && overflowBottom) {
    // Modal is too tall, center it vertically
    adjustedPosition.top = Math.max(
      padding,
      (options.viewport.height - options.modalRect.height) / 2
    )
  }

  return adjustedPosition
}
