import type {
  GetModalStyleForNoPositionOptions,
  ModalStyleResult,
} from '../types'

export const getModalStyleForNoPosition = (
  options: GetModalStyleForNoPositionOptions
): ModalStyleResult => {
  // Case 1: No position calculated yet (non-hover)
  if (!options.hovering) {
    return {
      style: {
        position: 'fixed',
        visibility: 'hidden',
        opacity: 0,
        zIndex: 50,
        pointerEvents: 'none',
        // Keep at origin to prevent any potential layout shifts
        top: 0,
        left: 0,
      },
    }
  }

  // Case 2: Hover mode without position yet
  return {
    style: {
      position: 'absolute',
      visibility: 'hidden',
      opacity: 0,
      zIndex: 50,
      pointerEvents: options.isMouseInTransit ? 'auto' : 'none',
      top: 0,
      left: 0,
    },
  }
}
