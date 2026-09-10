import type { BuildModalStyleOptions } from '../types'

export const buildModalStyle = (
  options: BuildModalStyleOptions
): React.CSSProperties => {
  const style: React.CSSProperties = {
    // `fixed`, not `absolute`: the position is derived from getBoundingClientRect()
    // (viewport coordinates, no scroll offset added) and the modal is portaled to
    // document.body. With `absolute` the coordinates are resolved against the
    // document, so the popover only lines up at scrollTop 0 and drifts once the
    // page scrolls — which also breaks the viewport-overflow repositioning math.
    position: 'fixed',
    top:
      typeof options.modalPosition.top === 'number'
        ? `${options.modalPosition.top}px`
        : options.modalPosition.top,
    bottom:
      typeof options.modalPosition.bottom === 'number'
        ? `${options.modalPosition.bottom}px`
        : options.modalPosition.bottom,
    left:
      options.modalPosition.left === 'auto'
        ? 'auto'
        : `${options.modalPosition.left}px`,
    right:
      options.modalPosition.right === 'auto'
        ? 'auto'
        : `${options.modalPosition.right}px`,
    zIndex: 50,
    // Standardized hiding: use visibility and opacity for consistent behavior
    opacity: options.isWaitingForMeasurement ?? false ? 0 : 1,
    visibility: options.isWaitingForMeasurement ?? false ? 'hidden' : 'visible',
    // No need for display manipulation - visibility handles it properly
  }

  // Width handling (skip fullWidth for horizontal positioning - it doesn't make sense to match anchor width when positioned beside it)
  if (
    options.widthAnchor === 'anchor' ||
    (options.fullWidth && options.anchorDimensions.width && !options.isHorizontalPosition)
  ) {
    style.width = `${options.anchorDimensions.width}px`
  } else if (
    options.widthAnchor === 'parent' &&
    options.modalElementParent
  ) {
    style.width = `${options.modalElementParent.getBoundingClientRect().width}px`
  } else if (options.widthAnchor === 'window') {
    style.width = `${window.innerWidth}px`
  } else if (typeof options.widthAnchor === 'number') {
    style.width = `${options.widthAnchor}px`
  }

  // Height handling
  if (options.maxHeight) {
    style.maxHeight =
      typeof options.maxHeight === 'number'
        ? `${options.maxHeight}px`
        : options.maxHeight
    style.overflowY = 'auto'
  }

  if (options.maxWidth) {
    style.maxWidth =
      typeof options.maxWidth === 'number'
        ? `${options.maxWidth}px`
        : options.maxWidth
  }

  // Center transform (only for horizontal centering, not for horizontal positioning)
  if (
    options.origin === 'center' &&
    options.modalPosition.left !== 'auto' &&
    !options.isHorizontalPosition
  ) {
    style.transform = 'translateX(-50%)'
  }

  return style
}
