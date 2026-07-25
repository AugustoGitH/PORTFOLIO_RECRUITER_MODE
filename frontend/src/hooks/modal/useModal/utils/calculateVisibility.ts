import type { CalculateVisibilityOptions } from '../types'

export const calculateVisibility = (
  options: CalculateVisibilityOptions
): boolean => {
  const manualShow = options.base // Explicit control via 'show' prop

  // If allowModalHover is false, only consider anchor hover
  const hoverShow = options.hovering
    ? options.allowModalHover
      ? options.isHoveringAnchor ||
        options.isHoveringModal ||
        options.isMouseInTransit
      : options.isHoveringAnchor // Only anchor hover matters
    : false // Automatic control via hover

  // show is additive: manual OR hover (doesn't override)
  return (manualShow || hoverShow) && (options.safeShow ?? true)
}
