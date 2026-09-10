import type { IsPositionChangeSignificantOptions } from '../types'

export const isPositionChangeSignificant = (
  options: IsPositionChangeSignificantOptions
): boolean => {
  if (!options.oldPosition) return true

  // Check top difference (handle "auto" values)
  if (
    options.newPosition.top !== 'auto' &&
    options.oldPosition.top !== 'auto'
  ) {
    const topDiff = Math.abs(
      (options.newPosition.top as number) - (options.oldPosition.top as number)
    )
    if (topDiff > options.positionThreshould) return true
  } else if (options.newPosition.top !== options.oldPosition.top) {
    return true // Changed from/to "auto"
  }

  // Check bottom difference (handle "auto" values)
  if (
    options.newPosition.bottom !== 'auto' &&
    options.oldPosition.bottom !== 'auto'
  ) {
    const bottomDiff = Math.abs(
      (options.newPosition.bottom as number) -
        (options.oldPosition.bottom as number)
    )
    if (bottomDiff > options.positionThreshould) return true
  } else if (options.newPosition.bottom !== options.oldPosition.bottom) {
    return true // Changed from/to "auto"
  }

  // Check left difference (handle "auto" values)
  if (
    options.newPosition.left !== 'auto' &&
    options.oldPosition.left !== 'auto'
  ) {
    const leftDiff = Math.abs(
      (options.newPosition.left as number) -
        (options.oldPosition.left as number)
    )
    if (leftDiff > options.positionThreshould) return true
  } else if (options.newPosition.left !== options.oldPosition.left) {
    return true // Changed from/to "auto"
  }

  // Check right difference (handle "auto" values)
  if (
    options.newPosition.right !== 'auto' &&
    options.oldPosition.right !== 'auto'
  ) {
    const rightDiff = Math.abs(
      (options.newPosition.right as number) -
        (options.oldPosition.right as number)
    )
    if (rightDiff > options.positionThreshould) return true
  } else if (options.newPosition.right !== options.oldPosition.right) {
    return true // Changed from/to "auto"
  }

  return false
}
