import type {
  CalculateSideFallbackOptions,
  CalculateSideFallbackResult,
} from '../types'

export const calculateSideFallback = (
  options: CalculateSideFallbackOptions
): CalculateSideFallbackResult => {
  const { position, modalRect, anchorRect, viewport, config, offset, origin } = options
  const padding = config.padding ?? 16
  // Gap between modal and anchor (use offset.bottom as reference, similar to vertical gap)
  const sideGap = offset?.bottom ?? 8

  // When origin is 'center', buildModalStyle applies translateX(-50%)
  // We need to compensate for this in our position calculation
  const isCenterOrigin = origin === 'center'

  // Check if there's vertical overflow
  const positionTop =
    typeof position.top === 'number' ? position.top : 0
  const overflowBottom =
    positionTop + modalRect.height > viewport.height - padding

  // If no overflow, return original position
  if (!overflowBottom) {
    return { position, appliedSide: null }
  }

  // Determine preferred side
  const preferredSide = config.preferredSide ?? 'left'

  // Calculate available space on each side (including gap)
  const spaceLeft = anchorRect.left - padding - sideGap
  const spaceRight = viewport.width - anchorRect.right - padding - sideGap

  // Check if modal fits on preferred side
  const fitsOnLeft = spaceLeft >= modalRect.width
  const fitsOnRight = spaceRight >= modalRect.width

  // Determine which side to use
  let targetSide: 'left' | 'right' | null = null

  if (preferredSide === 'left') {
    if (fitsOnLeft) {
      targetSide = 'left'
    } else if (fitsOnRight) {
      targetSide = 'right'
    }
  } else {
    if (fitsOnRight) {
      targetSide = 'right'
    } else if (fitsOnLeft) {
      targetSide = 'left'
    }
  }

  // If can't fit on either side, return original position
  if (!targetSide) {
    return { position, appliedSide: null }
  }

  // Calculate new position
  const adjustedPosition = { ...position }

  if (targetSide === 'left') {
    // Position modal's right edge at anchor's left edge with gap
    let leftPos = anchorRect.left - modalRect.width - sideGap
    // Compensate for translateX(-50%) when origin is center
    if (isCenterOrigin) {
      leftPos += modalRect.width / 2
    }
    adjustedPosition.left = leftPos
    adjustedPosition.right = 'auto'
  } else {
    // Position modal's left edge at anchor's right edge with gap
    let leftPos = anchorRect.right + sideGap
    // Compensate for translateX(-50%) when origin is center
    if (isCenterOrigin) {
      leftPos += modalRect.width / 2
    }
    adjustedPosition.left = leftPos
    adjustedPosition.right = 'auto'
  }

  // Align vertically with anchor (top of modal at top of anchor)
  adjustedPosition.top = anchorRect.top

  // If modal would overflow bottom when aligned with anchor top, adjust
  if (anchorRect.top + modalRect.height > viewport.height - padding) {
    // Align bottom of modal with bottom of viewport
    adjustedPosition.top = viewport.height - modalRect.height - padding
  }

  // If modal would overflow top, adjust
  if (typeof adjustedPosition.top === 'number' && adjustedPosition.top < padding) {
    adjustedPosition.top = padding
  }

  // Calculate arrow offset: position arrow to point at anchor center
  // Arrow offset is relative to the top of the popover
  const popoverTop = typeof adjustedPosition.top === 'number' ? adjustedPosition.top : 0
  const anchorCenterY = anchorRect.top + anchorRect.height / 2
  const arrowOffset = Math.max(12, Math.min(anchorCenterY - popoverTop, modalRect.height - 12))

  return {
    position: adjustedPosition,
    appliedSide: targetSide,
    arrowOffset,
  }
}
