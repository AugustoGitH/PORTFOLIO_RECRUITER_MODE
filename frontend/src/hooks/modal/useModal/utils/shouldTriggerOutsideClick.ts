import type { ShouldTriggerOutsideClickOptions } from '../types'

const getEffectiveZIndex = (element: HTMLElement | null): number => {
  let current = element

  while (current) {
    const style = window.getComputedStyle(current)
    const zIndex = parseInt(style.zIndex, 10)

    if (!isNaN(zIndex) && style.position !== 'static') {
      return zIndex
    }

    current = current.parentElement
  }

  return 0
}

export const shouldTriggerOutsideClick = (
  options: ShouldTriggerOutsideClickOptions
): boolean => {
  // If modal is not rendered, no need to check for outside click
  if (!options.modalElement) {
    return false
  }

  const isInAnchor =
    options.anchorElement && options.anchorElement.contains(options.node)

  const modalNode = options.modalElement?.getAttribute('node-menu')
  const clickedNodeEl = (options.node as any).closest(`[node-menu]`)
  const clickedNode = clickedNodeEl?.getAttribute('node-menu')

  if (isInAnchor) {
    return false
  }

  // Ignore clicks on elements in higher z-index layers (e.g. overlays opened on top)
  const modalZIndex = getEffectiveZIndex(options.modalElement as HTMLElement | null)
  const clickedZIndex = getEffectiveZIndex(options.node as HTMLElement)

  if (clickedZIndex > modalZIndex) {
    return false
  }

  if (!modalNode || !clickedNode) {
    return true
  }

  const isClickedNodeDescendantOfModal =
    clickedNode === modalNode || clickedNode.startsWith(`${modalNode}.`)

  return !isClickedNodeDescendantOfModal
}
