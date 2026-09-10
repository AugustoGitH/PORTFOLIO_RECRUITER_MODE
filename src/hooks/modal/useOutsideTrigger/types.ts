export type OutsideTriggerEvent = 'mousedown' | 'mouseenter' | 'mouseleave'

export type OutsideTriggerOptions = {
  onOutsideClick?: () => void
  shouldTrigger?:
    | ((clickedNode: Node, targetElement: Element | null) => boolean)
    | boolean
}
