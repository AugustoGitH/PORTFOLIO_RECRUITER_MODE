import type {
  GetSmartPositioningConfigOptions,
  SmartPositioningConfig,
} from '../types'

export const getSmartPositioningConfig = (
  options: GetSmartPositioningConfigOptions
): SmartPositioningConfig => {
  if (typeof options.smartPositioning === 'boolean') {
    return {
      enabled: options.smartPositioning,
      verticalAdjustment: true,
      horizontalFallback: true,
      preserveOffsets: true,
      minPadding: options.overflowPadding || 16,
    }
  }
  return {
    verticalAdjustment: true,
    horizontalFallback: true,
    preserveOffsets: true,
    minPadding: options.overflowPadding || 16,
    ...options.smartPositioning,
    enabled: true,
  }
}
