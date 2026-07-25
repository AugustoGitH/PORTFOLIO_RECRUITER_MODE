import type { CalculateSmartPositionOptions, CalculateSmartPositionResult } from '../types'

import { calculateAdvancedSmartPosition } from './calculateAdvancedSmartPosition'
import { calculateLegacySmartPosition } from './calculateLegacySmartPosition'
import { calculateSideFallback } from './calculateSideFallback'
import { getAutoRepositionConfig } from './getAutoRepositionConfig'

export const calculateSmartPosition = (
  options: CalculateSmartPositionOptions
): CalculateSmartPositionResult => {
  const autoRepositionConfig = getAutoRepositionConfig({
    autoRepositionOnOverflow: options.autoRepositionOnOverflow,
    overflowPadding: options.overflowPadding,
  })

  if (!autoRepositionConfig.enabled || !options.modalElement) {
    return { position: options.position, appliedSide: null }
  }

  // Handle side fallback when verticalFallback is 'side'
  if (
    autoRepositionConfig.verticalFallback === 'side' &&
    options.anchorRect
  ) {
    const modalRect = options.modalElement.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const result = calculateSideFallback({
      position: options.position,
      modalRect,
      anchorRect: options.anchorRect,
      viewport,
      config: autoRepositionConfig,
      offset: options.offset,
      origin: options.origin,
    })

    // If side fallback was applied, return the new position with side info
    if (result.appliedSide) {
      return {
        position: result.position,
        appliedSide: result.appliedSide,
        arrowOffset: result.arrowOffset,
      }
    }

    // If side fallback couldn't be applied (no space on either side),
    // fall through to legacy positioning
  }

  // If smartPositioning is enabled, use the advanced logic
  if (options.smartPositioning && options.anchorRect) {
    return {
      position: calculateAdvancedSmartPosition({
        position: options.position,
        modalElement: options.modalElement,
        anchorRect: options.anchorRect,
        smartPositioning: options.smartPositioning,
        overflowPadding: options.overflowPadding,
        origin: options.origin,
        offset: options.offset,
      }),
      appliedSide: null,
    }
  }

  // Otherwise, use the legacy logic for backward compatibility
  return {
    position: calculateLegacySmartPosition({
      position: options.position,
      modalElement: options.modalElement,
      overflowPadding: options.overflowPadding,
      origin: options.origin,
    }),
    appliedSide: null,
  }
}
