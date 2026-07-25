import type { CalculateInitialPositionOptions, ModalPosition } from '../types'

export const calculateInitialPosition = (
  options: CalculateInitialPositionOptions
): ModalPosition => {
  // Set initial vertical position based on strategy
  // When direction is top but height is unknown, use a temporary position
  // that will be hidden (handled in modalController)
  const initialTop = options.useTopPosition
    ? options.modalHeight > 0
      ? options.anchorRect.top - options.modalHeight - options.offsetTop // Position above the anchor
      : options.anchorRect.bottom // Temporary position (will be hidden)
    : options.anchorRect.bottom + options.offsetBottom // Position below the anchor (default)

  return {
    top: initialTop,
    bottom: 'auto',
    left: options.anchorRect.left,
    right: 'auto',
  }
}
