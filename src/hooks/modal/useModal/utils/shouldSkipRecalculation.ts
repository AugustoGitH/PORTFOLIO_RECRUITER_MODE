import type { ShouldSkipRecalculationOptions } from '../types'

export const shouldSkipRecalculation = (
  options: ShouldSkipRecalculationOptions
): boolean => {
  // Skip calculation if position hasn't changed (unless forced)
  // For hover mode with smart positioning already applied, avoid unnecessary recalculations
  if (
    !options.forceRecalc &&
    options.lastCalculatedPosition === options.positionFingerprint
  ) {
    return true
  }

  // For hover mode, if smart positioning was already applied and fingerprint is the same,
  // we don't need to recalculate even if it's hover triggered
  if (
    options.hovering &&
    options.smartPositionApplied &&
    options.lastCalculatedPosition === options.positionFingerprint &&
    !options.forceRecalc
  ) {
    return true
  }

  return false
}
