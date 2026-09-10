import type { CreatePositionFingerprintOptions } from '../types'

export const createPositionFingerprint = (
  options: CreatePositionFingerprintOptions
): string => {
  return `${options.anchorRect.x}-${options.anchorRect.y}-${options.anchorRect.width}-${options.anchorRect.height}-${options.modalRect?.width || 0}-${options.modalRect?.height || 0}`
}
