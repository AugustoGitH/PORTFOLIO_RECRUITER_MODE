import type { CalculatePositionByOriginOptions, ModalPosition } from '../types'

export const calculatePositionByOrigin = (
  options: CalculatePositionByOriginOptions
): ModalPosition => {
  const position = { ...options.position }

  if (options.origin === 'left') {
    position.left = options.anchorRect.left
    position.top = options.useTopPosition
      ? options.anchorRect.top - options.modalHeight - options.offsetTop
      : options.anchorRect.bottom + options.offsetBottom
  }

  if (options.origin === 'right') {
    position.left = 'auto'
    position.right = window.innerWidth - options.anchorRect.right
    position.top = options.useTopPosition
      ? options.anchorRect.top - options.modalHeight - options.offsetTop
      : options.anchorRect.bottom + options.offsetBottom
  }

  if (options.origin === 'sub-right') {
    position.left = options.anchorRect.right
    position.top = options.anchorRect.top + options.offsetTop
  }

  if (options.origin === 'sub-left') {
    position.left = 'auto'
    position.right = window.innerWidth - options.anchorRect.left
    position.top = options.anchorRect.top + options.offsetTop
  }

  if (options.origin === 'center') {
    position.left = options.anchorRect.left + options.anchorRect.width / 2
    position.top = options.useTopPosition
      ? options.anchorRect.top - options.modalHeight - options.offsetTop
      : options.anchorRect.bottom + options.offsetBottom
  }

  return position
}
