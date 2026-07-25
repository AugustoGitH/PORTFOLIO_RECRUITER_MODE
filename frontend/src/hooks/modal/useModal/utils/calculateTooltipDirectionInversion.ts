import type {
  CalculateTooltipDirectionInversionOptions,
  CalculateTooltipDirectionInversionResult,
} from '../types'

import { calculateSmartPosition } from './calculateSmartPosition'

export const calculateTooltipDirectionInversion = (
  options: CalculateTooltipDirectionInversionOptions
): CalculateTooltipDirectionInversionResult => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const modalRect = options.modalElement.getBoundingClientRect()
  const padding = options.overflowPadding || 16

  const positionTop =
    typeof options.position.top === 'number' ? options.position.top : 0
  const wouldOverflowBottom =
    positionTop + modalRect.height > viewport.height - padding
  const wouldOverflowTop = positionTop < padding

  // If it will overflow bottom and not using top position, invert to top
  if (wouldOverflowBottom && !options.useTopPosition && !wouldOverflowTop) {
    const spaceAbove = options.anchorRect.top - padding
    const willFitAbove = modalRect.height + options.offsetBottom <= spaceAbove

    if (willFitAbove) {
      // Invert to TOP using bottom property
      options.position.top = 'auto'
      options.position.bottom =
        viewport.height - options.anchorRect.top + options.offsetBottom
      return { position: options.position, appliedSide: null }
    }

    // If it doesn't fit above, use normal smart positioning
    return calculateSmartPosition({
      position: options.position,
      modalElement: options.modalElement,
      autoRepositionOnOverflow: options.autoRepositionOnOverflow,
      smartPositioning: options.smartPositioning,
      anchorRect: options.anchorRect,
      overflowPadding: options.overflowPadding,
      origin: options.origin,
      offset: options.offset,
    })
  }

  // If it's in top but overflows the top, invert to bottom
  if (wouldOverflowTop && options.useTopPosition && !wouldOverflowBottom) {
    const spaceBelow = viewport.height - options.anchorRect.bottom - padding
    const willFitBelow = modalRect.height + options.offsetBottom <= spaceBelow

    if (willFitBelow) {
      // Invert to BOTTOM using top property
      options.position.top = options.anchorRect.bottom + options.offsetBottom
      options.position.bottom = 'auto'
      return { position: options.position, appliedSide: null }
    }

    return calculateSmartPosition({
      position: options.position,
      modalElement: options.modalElement,
      autoRepositionOnOverflow: options.autoRepositionOnOverflow,
      smartPositioning: options.smartPositioning,
      anchorRect: options.anchorRect,
      overflowPadding: options.overflowPadding,
      origin: options.origin,
      offset: options.offset,
    })
  }

  return { position: options.position, appliedSide: null }
}
