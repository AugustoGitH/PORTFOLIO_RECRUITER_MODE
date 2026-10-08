import type { PopoverOrigin } from '../../../components/general/Popover'

export type PositionStrategy = 'bottom' | 'top' | 'left' | 'right'

export type AutoRepositionVerticalFallback = 'flip' | 'side'

export type AutoRepositionConfig = {
  enabled?: boolean
  verticalFallback?: AutoRepositionVerticalFallback
  preferredSide?: 'left' | 'right'
  padding?: number
  showArrowOnSide?: boolean
}

export type AppliedSideFallback = 'left' | 'right' | null

/** Side of the anchor a popover with an arrow ended up on. */
export type AnchoredDirection = 'top' | 'bottom' | 'left' | 'right'

export type AnchoredPlacement = {
  direction: AnchoredDirection
  /** Distance, in px, from the popover's start edge (left for top/bottom, top for left/right) to the
   * anchor's center: where the arrow has to sit to keep pointing at the anchor. */
  arrowOffset: number
}

export type AutoRepositionOnOverflow = boolean | AutoRepositionConfig

export type ModalPosition = {
  top: number | 'auto'
  bottom: number | 'auto'
  left: number | 'auto'
  right: number | 'auto'
}

export type SmartPositioningConfig = {
  enabled: boolean
  verticalAdjustment?: boolean
  horizontalFallback?: boolean
  preserveOffsets?: boolean
  minPadding?: number
}

export type ModalVisibilityOptions = {
  show?: boolean
  onClose?: () => void
  onShow?: () => void
}

export type ModalOffset = {
  top?: number
  bottom?: number
}

type ModalBaseOptions<A extends HTMLElement> = {
  safeShow?: boolean
  anchorRef?: React.RefObject<A | null>
  origin?: PopoverOrigin
  fullWidth?: boolean
  offset?: ModalOffset
  positionThreshould?: number
  hovering?: boolean
  hoverGapTolerance?: number
  hoverOpenDelay?: number
  hoverCloseDelay?: number
  allowModalHover?: boolean

  persistOnManualOpen?: boolean
  disableOutsideClick?: boolean
  widthAnchor?: 'parent' | 'window' | 'anchor' | number
  maxHeight?: number | string
  maxWidth?: number | string
  positionStrategy?: PositionStrategy[]
  customPosition?: (
    anchorRect: DOMRect,
    modalElement: HTMLElement | null
  ) => ModalPosition
  wrapperSelector?: string
  autoRepositionOnOverflow?: AutoRepositionOnOverflow
  overflowPadding?: number
  smartPositioning?: boolean | SmartPositioningConfig
  /** Keeps the anchor uncovered and reports where the arrow must sit, instead of the sliding
   * reposition of `autoRepositionOnOverflow`. Meant for popovers that draw an arrow. */
  anchoredPlacement?: boolean
}

export type ModalOptions<A extends HTMLElement = HTMLElement> =
  ModalBaseOptions<A> & ModalVisibilityOptions

// #region Utility Function Types

export type AnchorBoundsResult = {
  isOutside: boolean
  details: {
    isOutsideTop: boolean
    isOutsideBottom: boolean
    isOutsideLeft: boolean
    isOutsideRight: boolean
  }
}

export type BuildModalStyleOptions = {
  modalPosition: ModalPosition
  isWaitingForMeasurement?: boolean | null
  origin?: PopoverOrigin
  anchorDimensions: {
    width: number | null
    height: number | null
  }
  widthAnchor?: 'parent' | 'window' | 'anchor' | number
  fullWidth?: boolean
  maxHeight?: number | string
  maxWidth?: number | string
  modalElementParent?: HTMLElement | null
  isHorizontalPosition?: boolean
}

export type CalculateAdvancedSmartPositionOptions = {
  position: ModalPosition
  modalElement: HTMLElement
  anchorRect: DOMRect
  smartPositioning: boolean | SmartPositioningConfig
  overflowPadding?: number
  origin?: PopoverOrigin
  offset?: ModalOffset
}

export type CalculateHorizontalFallbackOptions = {
  position: ModalPosition
  modalRect: DOMRect
  anchorRect: DOMRect
  viewport: { width: number; height: number }
  config: SmartPositioningConfig
  origin: PopoverOrigin
  offset?: ModalOffset
}

export type CalculateInitialPositionOptions = {
  anchorRect: DOMRect
  modalHeight: number
  offsetTop: number
  offsetBottom: number
  useTopPosition?: boolean
}

export type CalculateLegacySmartPositionOptions = {
  position: ModalPosition
  modalElement: HTMLElement
  overflowPadding?: number
  origin?: PopoverOrigin
}

export type CalculatePositionByOriginOptions = {
  position: ModalPosition
  origin: PopoverOrigin
  anchorRect: DOMRect
  modalHeight: number
  offsetTop: number
  offsetBottom: number
  useTopPosition?: boolean
}

export type CalculateSmartPositionOptions = {
  position: ModalPosition
  modalElement: HTMLElement | null
  autoRepositionOnOverflow?: AutoRepositionOnOverflow
  smartPositioning?: boolean | SmartPositioningConfig
  anchorRect?: DOMRect
  overflowPadding?: number
  origin?: PopoverOrigin
  offset?: ModalOffset
}

export type CalculateSmartPositionResult = {
  position: ModalPosition
  appliedSide: AppliedSideFallback
  arrowOffset?: number
}

export type CalculateTooltipDirectionInversionOptions = {
  position: ModalPosition
  modalElement: HTMLElement
  anchorRect: DOMRect
  useTopPosition: boolean | undefined
  offsetBottom: number
  overflowPadding?: number
  autoRepositionOnOverflow?: AutoRepositionOnOverflow
  smartPositioning?: boolean | SmartPositioningConfig
  origin?: PopoverOrigin
  offset?: ModalOffset
}

export type CalculateTooltipDirectionInversionResult = {
  position: ModalPosition
  appliedSide: AppliedSideFallback
  arrowOffset?: number
}

export type CalculateVerticalAdjustmentOptions = {
  position: ModalPosition
  modalRect: DOMRect
  anchorRect: DOMRect
  viewport: { width: number; height: number }
  config: SmartPositioningConfig
  offset?: ModalOffset
}

export type CalculateVisibilityOptions = {
  base: boolean
  hovering?: boolean
  allowModalHover?: boolean
  safeShow?: boolean
  isHoveringAnchor: boolean
  isHoveringModal: boolean
  isMouseInTransit: boolean
}

export type CheckAnchorWithinBoundsOptions = {
  anchorRect: DOMRect
  wrapperRect: DOMRect
}

export type CreatePositionFingerprintOptions = {
  anchorRect: DOMRect
  modalRect?: DOMRect
}

export type GetModalStyleForNoPositionOptions = {
  hovering?: boolean
  isMouseInTransit: boolean
}

export type GetSmartPositioningConfigOptions = {
  smartPositioning: boolean | SmartPositioningConfig
  overflowPadding?: number
}

export type IsPositionChangeSignificantOptions = {
  newPosition: ModalPosition
  oldPosition: ModalPosition | null
  positionThreshould: number
}

export type ModalStyleResult = {
  style: React.CSSProperties
}

export type ShouldRecalculateOnMutationOptions = {
  mutations: MutationRecord[]
}

export type ShouldSkipRecalculationOptions = {
  forceRecalc: boolean
  lastCalculatedPosition: string
  positionFingerprint: string
  hovering?: boolean
  smartPositionApplied: boolean
}

export type ShouldTriggerOutsideClickOptions = {
  node: Node
  modalElement: Element | null
  anchorElement: HTMLElement | null
}

export type CalculateSideFallbackOptions = {
  position: ModalPosition
  modalRect: DOMRect
  anchorRect: DOMRect
  viewport: { width: number; height: number }
  config: AutoRepositionConfig
  offset?: ModalOffset
  origin?: PopoverOrigin
}

export type CalculateSideFallbackResult = {
  position: ModalPosition
  appliedSide: 'left' | 'right' | null
  arrowOffset?: number
}

// #endregion

export type CalculateAnchoredPositionOptions = {
  anchorRect: DOMRect
  modal: { width: number; height: number }
  viewport: { width: number; height: number }
  /** Side the popover prefers; the opposite side and then the lateral ones are fallbacks. */
  preferred: 'top' | 'bottom'
  origin: PopoverOrigin
  padding: number
  offset: { top: number; bottom: number }
}

export type CalculateAnchoredPositionResult = {
  position: ModalPosition
} & AnchoredPlacement
