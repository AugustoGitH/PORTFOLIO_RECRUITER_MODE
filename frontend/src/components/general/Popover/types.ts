import type { AutoRepositionOnOverflow, ModalVisibilityOptions, SmartPositioningConfig } from '../../../hooks/modal'
import type { ChildrenRenderer, PresetComponent } from '../../../utils/types'

export type PopoverOrigin =
  | 'right'
  | 'left'
  | 'sub-right'
  | 'sub-left'
  | 'center'

export type PopoverDirection = 'top' | 'bottom' | 'left' | 'right'

export type PopoverState<A extends HTMLElement = HTMLElement> = {
  onShow: (e?: React.MouseEvent<A>) => void
  onClose: () => void
  onToggleShow: (e?: React.MouseEvent<A>) => void
  show: boolean
}

export type PopoverAnchor<
  A extends HTMLElement = HTMLElement,
  E = PopoverState<A>,
> = {
  ref: React.RefObject<A | null>
  element?: ChildrenRenderer<E>
}

export type PopoverFieldProps = {
  paperProps?: React.ComponentProps<'div'>
  boxProps?: React.ComponentProps<'div'>
  arrowProps?: React.ComponentProps<'div'>
}

export type PopoverBase<A extends HTMLElement> = {
  fullWidth?: boolean
  origin?: PopoverOrigin
  direction?: PopoverDirection
  anchor: PopoverAnchor<A>
  children: ChildrenRenderer<PopoverState<A>>
  hovering?: boolean
  hoverGapTolerance?: number
  hoverOpenDelay?: number
  hoverCloseDelay?: number
  allowModalHover?: boolean
  persistOnManualOpen?: boolean
  disableOutsideClick?: boolean
  wrapperSelector?: string
  autoRepositionOnOverflow?: AutoRepositionOnOverflow
  overflowPadding?: number
  smartPositioning?: boolean | SmartPositioningConfig
  arrow?: boolean
}

export type PopoverProps<A extends HTMLElement = HTMLElement> = PresetComponent<
  PopoverBase<A> & PopoverFieldProps & ModalVisibilityOptions
>
