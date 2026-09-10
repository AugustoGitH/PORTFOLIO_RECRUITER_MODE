import type { CalculateAdvancedSmartPositionOptions, ModalPosition } from '../types'

import { calculateHorizontalFallback } from './calculateHorizontalFallback'
import { calculateLegacySmartPosition } from './calculateLegacySmartPosition'
import { calculateVerticalAdjustment } from './calculateVerticalAdjustment'
import { getSmartPositioningConfig } from './getSmartPositioningConfig'

export const calculateAdvancedSmartPosition = (
  options: CalculateAdvancedSmartPositionOptions
): ModalPosition => {
  const config = getSmartPositioningConfig({
    smartPositioning: options.smartPositioning,
    overflowPadding: options.overflowPadding,
  })

  if (!config.enabled) {
    return calculateLegacySmartPosition({
      position: options.position,
      modalElement: options.modalElement,
      overflowPadding: options.overflowPadding,
      origin: options.origin,
    })
  }

  const modalRect = options.modalElement.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // Step 1: Apply horizontal fallbacks
  let adjustedPosition = calculateHorizontalFallback({
    position: options.position,
    modalRect,
    anchorRect: options.anchorRect,
    viewport,
    config,
    origin: options.origin || 'center',
    offset: options.offset,
  })

  // Step 2: Apply vertical adjustments (independent of horizontal)
  adjustedPosition = calculateVerticalAdjustment({
    position: adjustedPosition,
    modalRect,
    anchorRect: options.anchorRect,
    viewport,
    config,
    offset: options.offset,
  })

  return adjustedPosition
}
