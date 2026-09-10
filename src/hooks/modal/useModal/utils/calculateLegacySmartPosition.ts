import type { CalculateLegacySmartPositionOptions, ModalPosition } from '../types'

export const calculateLegacySmartPosition = (
  options: CalculateLegacySmartPositionOptions
): ModalPosition => {
  const padding = options.overflowPadding || 16
  const modalRect = options.modalElement.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const adjustedPosition = { ...options.position }

  // Calculate actual position values
  let actualLeft =
    options.position.left === 'auto'
      ? viewport.width -
        (options.position.right === 'auto'
          ? 0
          : (options.position.right as number)) -
        modalRect.width
      : (options.position.left as number)

  // For center origin, account for the translateX(-50%) transform
  // that will be applied later to center the modal
  if (options.origin === 'center' && options.position.left !== 'auto') {
    actualLeft = actualLeft - modalRect.width / 2
  }

  const actualTop = options.position.top as number

  // Check right overflow
  if (actualLeft + modalRect.width > viewport.width - padding) {
    if (options.position.left !== 'auto') {
      // For center origin, we need to adjust considering the transform
      if (options.origin === 'center') {
        // Calculate the maximum left position that won't overflow
        // considering the -50% transform that will be applied
        const maxLeft = viewport.width - padding - modalRect.width / 2
        adjustedPosition.left = Math.min(options.position.left as number, maxLeft)
      } else {
        adjustedPosition.left = Math.max(
          padding,
          viewport.width - modalRect.width - padding
        )
      }
    } else {
      adjustedPosition.right = padding
    }
  }

  // Check left overflow
  if (actualLeft < padding) {
    if (options.origin === 'center') {
      // For center origin, ensure minimum position considering transform
      const minLeft = padding + modalRect.width / 2
      adjustedPosition.left = Math.max(minLeft, options.position.left as number)
    } else {
      adjustedPosition.left = padding
    }
    adjustedPosition.right = 'auto'
  }

  // Check bottom overflow (existing logic)
  if (actualTop + modalRect.height > viewport.height - padding) {
    const newTop = Math.max(
      padding,
      viewport.height - modalRect.height - padding
    )
    adjustedPosition.top = newTop
  }

  // Check top overflow (existing logic)
  if (actualTop < padding) {
    adjustedPosition.top = padding
  }

  return adjustedPosition
}
