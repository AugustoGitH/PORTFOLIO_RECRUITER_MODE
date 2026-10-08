import type { CalculateAnchoredPositionOptions, CalculateAnchoredPositionResult } from '../types'

// Keeps the arrow (a rotated 8px square) clear of the popover's rounded corners.
const ARROW_INSET = 12

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)))

/**
 * Places a popover against its anchor without ever covering it, and reports where the arrow has to
 * sit to keep pointing at the anchor's center.
 *
 * The popover takes the preferred side when it fits there, then the opposite side, then one of the
 * perpendicular sides. The popover slides along the edge to stay inside the viewport, and the arrow
 * does not slide with it: it stays at the anchor, clamped to the popover's edge.
 */
export const calculateAnchoredPosition = (
  options: CalculateAnchoredPositionOptions
): CalculateAnchoredPositionResult => {
  const { anchorRect, modal, viewport, padding, origin, offset } = options
  const sideGap = offset.bottom

  const anchorCenterX = anchorRect.left + anchorRect.width / 2
  const anchorCenterY = anchorRect.top + anchorRect.height / 2

  const space = {
    top: anchorRect.top - padding - offset.top,
    bottom: viewport.height - anchorRect.bottom - padding - offset.bottom,
    left: anchorRect.left - padding - sideGap,
    right: viewport.width - anchorRect.right - padding - sideGap,
  }

  const sideOrder = space.left >= space.right ? (['left', 'right'] as const) : (['right', 'left'] as const)
  const verticalFits = (side: 'top' | 'bottom') => modal.height <= space[side]

  const buildVertical = (direction: 'top' | 'bottom'): CalculateAnchoredPositionResult => {
    const desiredLeft = origin === 'left' ? anchorRect.left
      : origin === 'right' ? anchorRect.right - modal.width
        : anchorCenterX - modal.width / 2
    const left = clamp(desiredLeft, padding, viewport.width - padding - modal.width)
    const top = direction === 'top'
      ? anchorRect.top - offset.top - modal.height
      : anchorRect.bottom + offset.bottom

    return {
      position: {
        top: verticalFits(direction) ? top : clamp(top, padding, viewport.height - padding - modal.height),
        bottom: 'auto',
        left,
        right: 'auto',
      },
      direction,
      arrowOffset: clamp(anchorCenterX - left, ARROW_INSET, modal.width - ARROW_INSET),
    }
  }

  const buildSide = (direction: 'left' | 'right'): CalculateAnchoredPositionResult => {
    const left = direction === 'left' ? anchorRect.left - sideGap - modal.width : anchorRect.right + sideGap
    const top = clamp(anchorCenterY - modal.height / 2, padding, viewport.height - padding - modal.height)

    return {
      position: { top, bottom: 'auto', left, right: 'auto' },
      direction,
      arrowOffset: clamp(anchorCenterY - top, ARROW_INSET, modal.height - ARROW_INSET),
    }
  }

  const horizontalFits = (side: 'left' | 'right') => modal.width <= space[side]

  if (options.preferred === 'top' || options.preferred === 'bottom') {
    const opposite = options.preferred === 'top' ? 'bottom' : 'top'

    if (verticalFits(options.preferred)) return buildVertical(options.preferred)
    if (verticalFits(opposite)) return buildVertical(opposite)

    const side = sideOrder.find(horizontalFits)
    if (side) return buildSide(side)
  } else {
    const opposite = options.preferred === 'left' ? 'right' : 'left'

    if (horizontalFits(options.preferred)) return buildSide(options.preferred)
    if (horizontalFits(opposite)) return buildSide(opposite)

    const verticalOrder = space.top >= space.bottom ? (['top', 'bottom'] as const) : (['bottom', 'top'] as const)
    const vertical = verticalOrder.find(verticalFits)
    if (vertical) return buildVertical(vertical)
  }

  // Nothing fits around the anchor: use the roomier vertical side, kept inside the viewport.
  return buildVertical(space.top > space.bottom ? 'top' : 'bottom')
}
