/* eslint-disable react-hooks/exhaustive-deps, react-hooks/immutability, react-hooks/refs, react-hooks/set-state-in-effect -- this imperative positioning hook intentionally synchronizes DOM measurements, external visibility and mutable observer state. */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { DependencyList } from 'react'

import { setDefaultProps } from '../../../utils/preset'

import { useOutsideTrigger } from '../useOutsideTrigger'

import {
  AUTO_REPOSITION_DELAY_MS,
  DEBOUNCE_CONTENT_CHANGE_DELAY_MS,
  DEBOUNCE_DEFAULT_DELAY_MS,
  DEBOUNCE_MUTATION_DELAY_MS,
  DEBOUNCE_RESIZE_DELAY_MS,
  DEBOUNCE_WINDOW_RESIZE_DELAY_MS,
  DEFAULT_HOVER_CLOSE_DELAY,
  DEFAULT_HOVER_GAP_TOLERANCE,
  DEFAULT_HOVER_OPEN_DELAY,
  DEFAULT_OFFSET_BOTTOM,
  DEFAULT_OFFSET_TOP,
  DEFAULT_OVERFLOW_PADDING,
  DEFAULT_POSITION_THRESHOLD,
  MODAL_Z_INDEX,
  RECALC_TIMEOUT_MS,
  TIME_SINCE_LAST_RECALC_THRESHOLD_MS,
} from './constants'
import type {
  AppliedSideFallback,
  ModalOptions,
  ModalPosition,
  PositionStrategy,
} from './types'
import {
  buildModalStyle,
  calculateInitialPosition,
  calculatePositionByOrigin,
  calculateSmartPosition,
  calculateTooltipDirectionInversion,
  calculateVisibility,
  checkAnchorWithinBounds,
  createPositionFingerprint,
  getModalStyleForNoPosition,
  isPositionChangeSignificant,
  shouldRecalculateOnMutation,
  shouldSkipRecalculation,
  shouldTriggerOutsideClick,
} from './utils'

/**
 * @hook useModal
 * @description Manages modal positioning, visibility, and interactions. Supports anchor-based positioning, hover interactions, smart repositioning on overflow, and scroll tracking.
 *
 * @template A - Anchor element type (extends HTMLElement)
 * @template M - Modal element type (extends HTMLElement)
 *
 * @param {ModalOptions<A>} [_options] - Modal configuration
 * @param {boolean} [_options.show] - External control for modal visibility
 * @param {PopoverOrigin} [_options.origin] - Positioning origin ('center', 'left', 'right')
 * @param {boolean} [_options.safeShow] - Prevents flash of unstyled modal
 * @param {ModalOffset} [_options.offset] - Top/bottom offset from anchor
 * @param {number} [_options.positionThreshould] - Minimum position change to trigger update
 * @param {boolean} [_options.autoRepositionOnOverflow] - Auto-adjust position on viewport overflow
 * @param {number} [_options.overflowPadding] - Padding from viewport edges
 * @param {boolean} [_options.smartPositioning] - Enable advanced smart positioning
 * @param {number} [_options.hoverGapTolerance] - Gap tolerance for hover transitions
 * @param {number} [_options.hoverOpenDelay] - Delay before opening on hover
 * @param {number} [_options.hoverCloseDelay] - Delay before closing on hover leave
 * @param {boolean} [_options.allowModalHover] - Allow hovering over modal content
 * @param {DependencyList} [dependencies] - Additional dependencies for position recalculation
 *
 * @output {boolean} status.isShowModal - Current modal visibility state
 * @output {RefObject} ref.modalElement - Ref for modal element
 * @output {RefObject} ref.anchorElement - Ref for anchor element
 * @output {Function} controller.modal - Returns props for modal element
 * @output {Function} controller.anchor - Returns props for anchor element
 * @output {Function} action.closeModal - Closes the modal
 * @output {Function} action.showModal - Opens the modal
 * @output {Function} action.toggleShowModal - Toggles modal visibility
 * @output {ModalPosition|null} layout.position - Current modal position coordinates
 * @output {PositionStrategy} layout.direction - Current positioning direction
 *
 * @returns {Object} Object with status, ref, controller, action, and layout categories
 *
 * @sideEffects
 * - Sets up ResizeObserver for anchor element
 * - Sets up MutationObserver for DOM changes
 * - Attaches scroll and resize listeners to window
 * - Manages hover timeout states
 *
 * @example
 * const modal = useModal<HTMLButtonElement>({
 *   origin: 'center',
 *   autoRepositionOnOverflow: true
 * })
 *
 * <button ref={modal.ref.anchorElement} onClick={modal.action.toggleShowModal}>
 *   Open
 * </button>
 * {modal.status.isShowModal && (
 *   <div ref={modal.ref.modalElement} {...modal.controller.modal()}>
 *     Content
 *   </div>
 * )}
 *
 * @features
 * - Anchor-based positioning with multiple origins
 * - Smart overflow repositioning
 * - Hover interactions with configurable delays
 * - Scroll and resize tracking
 * - Container bounds checking
 * - Direction inversion for tooltips
 */
export const useModal = <
  A extends HTMLElement = HTMLElement,
  M extends HTMLElement = HTMLElement,
>(
  _options: ModalOptions<A> = {},
  dependencies: DependencyList = []
) => {
  // #region Initialization
  const options = setDefaultProps(_options, {
    show: false,
    origin: 'center',
    safeShow: true,
    offset: {
      top: DEFAULT_OFFSET_TOP,
      bottom: DEFAULT_OFFSET_BOTTOM,
    },
    positionThreshould: DEFAULT_POSITION_THRESHOLD,
    autoRepositionOnOverflow: false,
    overflowPadding: DEFAULT_OVERFLOW_PADDING,
    smartPositioning: false,
    hoverGapTolerance: DEFAULT_HOVER_GAP_TOLERANCE,
    hoverOpenDelay: DEFAULT_HOVER_OPEN_DELAY,
    hoverCloseDelay: DEFAULT_HOVER_CLOSE_DELAY,
    allowModalHover: true,
  })

  // #endregion

  // #region States
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null)
  const [anchorDimensions, setAnchorDimensions] = useState<{
    width: number | null
    height: number | null
  }>({ width: null, height: null })

  const [isShowModal, setIsShowModal] = useState(false)
  const [isHoveringAnchor, setIsHoveringAnchor] = useState(false)
  const [isHoveringModal, setIsHoveringModal] = useState(false)
  const [isPositionCalculating, setIsPositionCalculating] = useState(false)
  const [isMouseInTransit, setIsMouseInTransit] = useState(false)
  const [appliedSideFallback, setAppliedSideFallback] = useState<AppliedSideFallback>(null)
  const [sideArrowOffset, setSideArrowOffset] = useState<number | undefined>(undefined)

  // #endregion

  // #region Refs
  const prevIsModalVisible = useRef(false)
  const internalAnchorElementRef = useRef<A | null>(null)
  const anchorElementRef = options.anchorRef || internalAnchorElementRef

  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const modalContentObserverRef = useRef<MutationObserver | null>(null)
  const positionCalculatedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lastCalculatedPosition = useRef<string>('')
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousAnchorSize = useRef<{ width: number; height: number } | null>(
    null
  )
  const lastRecalcTime = useRef<number>(0)
  const lastModalPosition = useRef<ModalPosition | null>(null)
  const mouseTransitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hoverOpenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollRafRef = useRef<number | null>(null)
  const isScrollUpdateScheduled = useRef(false)
  const smartPositionAppliedRef = useRef(false)

  // #endregion

  // #region Handlers

  const closeModal = useCallback(() => {
    setIsHoveringAnchor(false)
    setIsHoveringModal(false)

    setModalPosition(null)
    lastModalPosition.current = null
    lastCalculatedPosition.current = ''
    positionCalculatedRef.current = false
    smartPositionAppliedRef.current = false
    options.onClose?.()
    setIsShowModal(false)
  }, [options.onClose])

  const showModal = useCallback((e?: React.MouseEvent<A>) => {
    if (e) {
      e.stopPropagation()
    }

    setModalPosition(null)
    lastModalPosition.current = null
    lastCalculatedPosition.current = ''
    positionCalculatedRef.current = false
    smartPositionAppliedRef.current = false

    setIsPositionCalculating(true)

    setIsHoveringAnchor(true)
    setIsHoveringModal(true)

    setIsShowModal(true)
  }, [])

  const toggleShowModal = useCallback((e?: React.MouseEvent<A>) => {
    setIsShowModal((prevShow) => {
      const show = !prevShow
      if (e && show) {
        e.stopPropagation()
      }
      if (show) {
        setModalPosition(null)
        lastModalPosition.current = null
        lastCalculatedPosition.current = ''
        positionCalculatedRef.current = false
      }
      return show
    })
  }, [])

  const handleAnchorMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (mouseTransitTimeoutRef.current) {
      clearTimeout(mouseTransitTimeoutRef.current)
      mouseTransitTimeoutRef.current = null
    }

    if (options.hoverOpenDelay && options.hoverOpenDelay > 0) {
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current)
      }

      hoverOpenTimeoutRef.current = setTimeout(() => {
        setIsHoveringAnchor(true)
        setIsMouseInTransit(false)
        hoverOpenTimeoutRef.current = null

        if (options.hovering && anchorElementRef.current) {
          setIsPositionCalculating(true)
          calculateModalPosition(anchorElementRef.current, true, true)
        }
      }, options.hoverOpenDelay)
    } else {
      setIsHoveringAnchor(true)
      setIsMouseInTransit(false)

      if (options.hovering && anchorElementRef.current) {
        setIsPositionCalculating(true)
        calculateModalPosition(anchorElementRef.current, true, true)
      }
    }
  }

  const handleAnchorMouseLeave = () => {
    if (hoverOpenTimeoutRef.current) {
      clearTimeout(hoverOpenTimeoutRef.current)
      hoverOpenTimeoutRef.current = null
    }

    if (!options.allowModalHover) {
      setIsHoveringAnchor(false)
      return
    }

    setIsMouseInTransit(true)

    if (mouseTransitTimeoutRef.current) {
      clearTimeout(mouseTransitTimeoutRef.current)
    }

    mouseTransitTimeoutRef.current = setTimeout(() => {
      setIsHoveringAnchor(false)
      setIsMouseInTransit(false)
    }, options.hoverGapTolerance)
  }

  const handleModalMouseEnter = () => {
    if (!options.allowModalHover) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (mouseTransitTimeoutRef.current) {
      clearTimeout(mouseTransitTimeoutRef.current)
      mouseTransitTimeoutRef.current = null
    }

    setIsHoveringAnchor(false)
    setIsHoveringModal(true)
    setIsMouseInTransit(false)
  }

  const handleModalMouseLeave = () => {
    if (!options.allowModalHover) return

    setIsHoveringModal(false)
  }

  // #endregion

  // #region Constants

  const requiresMeasurement =
    options.positionStrategy?.includes('top') ||
    options.positionStrategy?.includes('left') ||
    options.positionStrategy?.includes('right')

  const isPositionReady = Boolean(
    modalPosition &&
      (!requiresMeasurement || positionCalculatedRef.current)
  )

  const isModalStateReady = Boolean(
    options.anchorRef
      ? isShowModal && (isPositionReady || isPositionCalculating)
      : isShowModal
  )

  const isModalVisibleForCalc = calculateVisibility({
    base: isShowModal,
    hovering: options.hovering,
    allowModalHover: options.allowModalHover,
    safeShow: options.safeShow,
    isHoveringAnchor,
    isHoveringModal,
    isMouseInTransit,
  })
  const isModalVisible = calculateVisibility({
    base: isModalStateReady,
    hovering: options.hovering,
    allowModalHover: options.allowModalHover,
    safeShow: options.safeShow,
    isHoveringAnchor,
    isHoveringModal,
    isMouseInTransit,
  })

  // #endregion

  // #region Hooks
  const [modalElementRef] = useOutsideTrigger({
    onOutsideClick: () => {
      options.onClose?.()
      setIsShowModal(false)
    },
    shouldTrigger: (node, modalElement) => {
      if (options.disableOutsideClick) return false
      return shouldTriggerOutsideClick({
        node,
        modalElement,
        anchorElement: anchorElementRef.current,
      })
    },
  })

  // #endregion

  // #region Advanced Smart Positioning Helpers

  // #endregion

  // #region Position Calculation
  const calculateModalPosition = useCallback(
    (element: A, forceRecalc = false, isHoverTriggered = false) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      const executeCalculation = () => {
        if (!element) {
          setIsPositionCalculating(false)
          return
        }

        const anchorRect = element.getBoundingClientRect()
        const modalElement = modalElementRef.current

        const modalRect = modalElement?.getBoundingClientRect()
        const positionFingerprint = createPositionFingerprint({
          anchorRect,
          modalRect,
        })

        if (
          shouldSkipRecalculation({
            forceRecalc,
            lastCalculatedPosition: lastCalculatedPosition.current,
            positionFingerprint,
            hovering: options.hovering,
            smartPositionApplied: smartPositionAppliedRef.current,
          })
        ) {
          setIsPositionCalculating(false)
          return
        }

        lastCalculatedPosition.current = positionFingerprint

        setAnchorDimensions({
          width: anchorRect.width,
          height: anchorRect.height,
        })

        if (options.customPosition && modalElement) {
          const customPosition = options.customPosition(
            anchorRect,
            modalElement
          )
          setModalPosition(customPosition)
          positionCalculatedRef.current = true
          setIsPositionCalculating(false)
          return
        }

        const offsetTop = options.offset.top || 0
        const offsetBottom = options.offset.bottom || 0

        const useTopPosition = options.positionStrategy?.includes('top')
        const useLeftPosition = options.positionStrategy?.includes('left')
        const useRightPosition = options.positionStrategy?.includes('right')
        const useHorizontalPosition = useLeftPosition || useRightPosition

        const modalHeight = modalElement?.offsetHeight || 0
        const modalWidth = modalElement?.offsetWidth || 0

        const needsRecalc = (useTopPosition && modalHeight === 0) || (useHorizontalPosition && modalWidth === 0)

        let position: ModalPosition

        if (useHorizontalPosition) {
          const sideGap = offsetBottom

          let leftPos: number
          if (useLeftPosition) {
            leftPos = anchorRect.left - modalWidth - sideGap
          } else {
            leftPos = anchorRect.right + sideGap
          }

          let topPos = anchorRect.top + (anchorRect.height - modalHeight) / 2

          const padding = options.overflowPadding || DEFAULT_OVERFLOW_PADDING
          if (topPos < padding) {
            topPos = padding
          } else if (topPos + modalHeight > window.innerHeight - padding) {
            topPos = window.innerHeight - modalHeight - padding
          }

          position = {
            top: topPos,
            bottom: 'auto',
            left: leftPos,
            right: 'auto',
          }
        } else {
          const initialPosition = calculateInitialPosition({
            anchorRect,
            modalHeight,
            offsetTop,
            offsetBottom,
            useTopPosition,
          })

          position = calculatePositionByOrigin({
            position: initialPosition,
            origin: options.origin || 'center',
            anchorRect,
            modalHeight,
            offsetTop,
            offsetBottom,
            useTopPosition,
          })
        }

        let finalPosition = position
        let newAppliedSide: AppliedSideFallback = null
        let newArrowOffset: number | undefined = undefined

        if (useHorizontalPosition) {
          newAppliedSide = useLeftPosition ? 'left' : 'right'
          const popoverTop = typeof position.top === 'number' ? position.top : 0
          const anchorCenterY = anchorRect.top + anchorRect.height / 2
          newArrowOffset = Math.max(12, Math.min(anchorCenterY - popoverTop, modalHeight - 12))
        } else if (
          options.autoRepositionOnOverflow &&
          modalElement &&
          !options.allowModalHover
        ) {
          const inversionResult = calculateTooltipDirectionInversion({
            position,
            modalElement,
            anchorRect,
            useTopPosition,
            offsetBottom,
            overflowPadding: options.overflowPadding,
            autoRepositionOnOverflow: options.autoRepositionOnOverflow,
            smartPositioning: options.smartPositioning,
            origin: options.origin,
            offset: options.offset,
          })
          finalPosition = inversionResult.position
          newAppliedSide = inversionResult.appliedSide
          newArrowOffset = inversionResult.arrowOffset
          smartPositionAppliedRef.current = true
        } else if (options.autoRepositionOnOverflow && modalElement) {
          const smartResult = calculateSmartPosition({
            position,
            modalElement,
            autoRepositionOnOverflow: options.autoRepositionOnOverflow,
            smartPositioning: options.smartPositioning,
            anchorRect,
            overflowPadding: options.overflowPadding,
            origin: options.origin,
            offset: options.offset,
          })
          finalPosition = smartResult.position
          newAppliedSide = smartResult.appliedSide
          newArrowOffset = smartResult.arrowOffset
          smartPositionAppliedRef.current = true
        }

        setAppliedSideFallback(newAppliedSide)
        setSideArrowOffset(newArrowOffset)

        const isSignificant = isPositionChangeSignificant({
          newPosition: finalPosition,
          oldPosition: lastModalPosition.current,
          positionThreshould: options.positionThreshould,
        })

        if (isSignificant) {
          setModalPosition(finalPosition)
          lastModalPosition.current = finalPosition
          positionCalculatedRef.current = !needsRecalc
        }

        if (needsRecalc && modalElement) {
          setTimeout(() => {
            positionCalculatedRef.current = true
            calculateModalPosition(element, true, false)
            setIsPositionCalculating(false)
          }, RECALC_TIMEOUT_MS)
        } else if ((useTopPosition && modalHeight > 0) || (useHorizontalPosition && modalWidth > 0)) {
          positionCalculatedRef.current = true
          setIsPositionCalculating(false)
        } else {
          setIsPositionCalculating(false)
        }
      }

      if (isHoverTriggered) {
        executeCalculation()
      } else {
        animationFrameRef.current = requestAnimationFrame(executeCalculation)
      }
    },
    [
      options.origin,
      options.offset,
      modalElementRef,
      options.customPosition,
      options.autoRepositionOnOverflow,
      options.smartPositioning,
      options.overflowPadding,
      anchorElementRef,
      options.positionStrategy,
      options.positionThreshould,
    ]
  )

  // #endregion

  // #region Debounced Position Calculation
  const debouncedCalculatePosition = useCallback(
    (
      element: A,
      forceRecalc = false,
      delay = DEBOUNCE_DEFAULT_DELAY_MS,
      isHoverTriggered = false
    ) => {
      const now = Date.now()
      const timeSinceLastRecalc = now - lastRecalcTime.current

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      if (
        forceRecalc ||
        timeSinceLastRecalc > TIME_SINCE_LAST_RECALC_THRESHOLD_MS ||
        isHoverTriggered
      ) {
        lastRecalcTime.current = now
        calculateModalPosition(element, forceRecalc, isHoverTriggered)
        return
      }

      debounceTimeoutRef.current = setTimeout(() => {
        lastRecalcTime.current = Date.now()
        calculateModalPosition(element, forceRecalc, isHoverTriggered)
      }, delay)
    },
    [calculateModalPosition]
  )

  // #endregion

  // #region Controllers
  const modalController = (): React.HTMLAttributes<M> => {
    const isStalePosition = modalPosition && lastModalPosition.current === null

    const isWaitingForMeasurement =
      requiresMeasurement && modalPosition && !positionCalculatedRef.current

    if (isStalePosition) {
      return {
        style: {
          position: 'fixed',
          visibility: 'hidden',
          opacity: 0,
          zIndex: MODAL_Z_INDEX,
          pointerEvents: 'none',
          top: 0,
          left: 0,
        },
      }
    }

    if (!modalPosition && !options.hovering) {
      return {
        style: {
          position: 'fixed',
          visibility: 'hidden',
          opacity: 0,
          zIndex: MODAL_Z_INDEX,
          pointerEvents: 'none',
          top: 0,
          left: 0,
        },
      }
    }

    if (!modalPosition && options.hovering) {
      return {
        style: {
          position: 'absolute',
          visibility: 'hidden',
          opacity: 0,
          zIndex: MODAL_Z_INDEX,
          pointerEvents: isMouseInTransit ? 'auto' : 'none',
          top: 0,
          left: 0,
        },
        onMouseEnter: handleModalMouseEnter,
        onMouseLeave: handleModalMouseLeave,
      }
    }

    if (!modalPosition) {
      const noPositionStyle = getModalStyleForNoPosition({
        hovering: options.hovering,
        isMouseInTransit,
      })

      if (options.hovering) {
        return {
          ...noPositionStyle,
          onMouseEnter: handleModalMouseEnter,
          onMouseLeave: handleModalMouseLeave,
        }
      }

      return noPositionStyle
    }

    const isHorizontalPosition = options.positionStrategy?.includes('left') || options.positionStrategy?.includes('right')
    const style = buildModalStyle({
      modalPosition,
      isWaitingForMeasurement,
      origin: options.origin,
      anchorDimensions,
      widthAnchor: options.widthAnchor,
      fullWidth: options.fullWidth,
      maxHeight: options.maxHeight,
      maxWidth: options.maxWidth,
      modalElementParent: modalElementRef.current?.parentElement,
      isHorizontalPosition,
    })

    return {
      style,
      onMouseEnter: handleModalMouseEnter,
      onMouseLeave: handleModalMouseLeave,
      onPointerEnter: handleModalMouseEnter,
      onPointerLeave: handleModalMouseLeave,
    }
  }

  const anchorController = (): React.HTMLAttributes<A> => ({
    onMouseEnter: handleAnchorMouseEnter,
    onMouseLeave: handleAnchorMouseLeave,
  })

  // #endregion

  // #region Effects
  useEffect(() => {
    if (!options.hovering) return

    if (options.persistOnManualOpen && options.show) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      return
    }

    if (isHoveringAnchor || isHoveringModal || isMouseInTransit) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      return
    }

    const shouldCloseViaHover =
      !isHoveringAnchor && !isHoveringModal && !isMouseInTransit && isShowModal

    if (shouldCloseViaHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!isHoveringAnchor && !isHoveringModal && !isMouseInTransit) {
          options.onClose?.()
          setIsShowModal(false)
        }
        hoverTimeoutRef.current = null
      }, options.hoverCloseDelay)
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }
  }, [
    isHoveringAnchor,
    isHoveringModal,
    isMouseInTransit,
    isShowModal,
    options.hovering,
    options.onClose,
    options.show,
    options.persistOnManualOpen,
  ])

  useEffect(() => {
    setIsShowModal(options.show)
    if (options.show) {
      setModalPosition(null)
      lastModalPosition.current = null
      lastCalculatedPosition.current = ''
      positionCalculatedRef.current = false
      setIsPositionCalculating(true)
    }
  }, [options.show])

  useEffect(() => {
    if (isModalVisible && !prevIsModalVisible.current) {
      options.onShow?.()
    }
    prevIsModalVisible.current = isModalVisible
  }, [isModalVisible, options.onShow])

  useEffect(() => {
    // In hover mode the position is calculated synchronously by the anchor
    // mouse-enter handler, which runs BEFORE the modal is mounted — so for
    // strategies that need the modal measured (top/left/right), that first pass
    // leaves `positionCalculatedRef` false and the modal stays hidden by
    // `isWaitingForMeasurement`. Once the modal is actually mounted we still need
    // one post-mount recalc to complete the measurement, hence the extra clause.
    const needsPostMountMeasurement =
      requiresMeasurement && !positionCalculatedRef.current

    const shouldCalculatePosition =
      isModalVisibleForCalc &&
      anchorElementRef.current &&
      (!options.hovering || needsPostMountMeasurement)

    if (shouldCalculatePosition && anchorElementRef.current) {
      calculateModalPosition(anchorElementRef.current, true, false)
    }
  }, [
    isModalVisibleForCalc,
    options.hovering,
    calculateModalPosition,
    anchorElementRef,
    ...dependencies,
  ])

  useEffect(() => {
    const anchorRef = anchorElementRef.current
    if (!anchorRef) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === anchorRef && isModalVisibleForCalc) {
          const { width, height } = entry.contentRect
          const prevSize = previousAnchorSize.current

          if (
            !prevSize ||
            prevSize.width !== width ||
            prevSize.height !== height
          ) {
            previousAnchorSize.current = { width, height }
            debouncedCalculatePosition(anchorRef, false, DEBOUNCE_RESIZE_DELAY_MS, false)
          }
        }
      }
    })

    observer.observe(anchorRef)
    resizeObserverRef.current = observer

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [anchorElementRef, isModalVisibleForCalc, debouncedCalculatePosition])

  useEffect(() => {
    const anchorRef = anchorElementRef.current
    if (!anchorRef) return

    const observer = new MutationObserver((mutations) => {
      const shouldRecalculate = mutations.some(
        (mutation) =>
          mutation.type === 'attributes' &&
          ['class', 'style'].includes(mutation.attributeName || '')
      )

      if (shouldRecalculate && isModalVisibleForCalc) {
        debouncedCalculatePosition(anchorRef, false, DEBOUNCE_MUTATION_DELAY_MS, false)
      }
    })

    observer.observe(anchorRef, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    mutationObserverRef.current = observer

    return () => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect()
      }
    }
  }, [anchorElementRef, isModalVisibleForCalc, debouncedCalculatePosition])

  useEffect(() => {
    if (!isModalVisibleForCalc || !anchorElementRef.current) return

    const handleScroll = () => {
      if (isScrollUpdateScheduled.current) return

      isScrollUpdateScheduled.current = true

      scrollRafRef.current = requestAnimationFrame(() => {
        if (anchorElementRef.current) {
          calculateModalPosition(anchorElementRef.current, false, false)
        }
        isScrollUpdateScheduled.current = false
      })
    }

    const handleResize = () => {
      if (anchorElementRef.current) {
        debouncedCalculatePosition(
          anchorElementRef.current,
          true,
          DEBOUNCE_WINDOW_RESIZE_DELAY_MS,
          false
        )
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
      isScrollUpdateScheduled.current = false
    }
  }, [
    anchorElementRef,
    isModalVisibleForCalc,
    calculateModalPosition,
    debouncedCalculatePosition,
  ])

  useEffect(() => {
    if (
      !isModalVisibleForCalc ||
      !anchorElementRef.current ||
      !options.wrapperSelector
    )
      return

    const handleContainerScroll = () => {
      if (isScrollUpdateScheduled.current) return

      isScrollUpdateScheduled.current = true

      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
      }

      scrollRafRef.current = requestAnimationFrame(() => {
        if (anchorElementRef.current && options.wrapperSelector) {
          const wrapperElement = document.querySelector(options.wrapperSelector)

          if (wrapperElement) {
            const anchorRect = anchorElementRef.current.getBoundingClientRect()
            const wrapperRect = wrapperElement.getBoundingClientRect()

            const boundsCheck = checkAnchorWithinBounds({
              anchorRect,
              wrapperRect,
            })

            if (boundsCheck.isOutside) {
              closeModal()
              isScrollUpdateScheduled.current = false
              return
            }
          }

          calculateModalPosition(anchorElementRef.current, false, false)
        }
        isScrollUpdateScheduled.current = false
      })
    }

    const wrapperElement = document.querySelector(options.wrapperSelector)
    if (!wrapperElement) return

    wrapperElement.addEventListener('scroll', handleContainerScroll, {
      passive: true,
    })

    let scrollableParent = anchorElementRef.current.parentElement
    const scrollableElements: Element[] = []

    while (scrollableParent && scrollableParent !== wrapperElement) {
      const style = window.getComputedStyle(scrollableParent)
      const overflow = style.overflow + style.overflowY + style.overflowX

      if (overflow.includes('auto') || overflow.includes('scroll')) {
        scrollableElements.push(scrollableParent)
        scrollableParent.addEventListener('scroll', handleContainerScroll, {
          passive: true,
        })
      }

      scrollableParent = scrollableParent.parentElement
    }

    return () => {
      wrapperElement.removeEventListener('scroll', handleContainerScroll)
      scrollableElements.forEach((element) => {
        element.removeEventListener('scroll', handleContainerScroll)
      })

      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
      isScrollUpdateScheduled.current = false
    }
  }, [
    anchorElementRef,
    isModalVisibleForCalc,
    calculateModalPosition,
    options.wrapperSelector,
    closeModal,
  ])

  useEffect(() => {
    const modalElement = modalElementRef.current
    if (!modalElement || !isModalVisibleForCalc) return

    const observer = new MutationObserver((mutations) => {
      const shouldRecalculate = shouldRecalculateOnMutation({ mutations })

      if (shouldRecalculate && anchorElementRef.current) {
        debouncedCalculatePosition(anchorElementRef.current, false, DEBOUNCE_CONTENT_CHANGE_DELAY_MS, false)
      }
    })

    observer.observe(modalElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    modalContentObserverRef.current = observer

    return () => {
      if (modalContentObserverRef.current) {
        modalContentObserverRef.current.disconnect()
      }
    }
  }, [
    modalElementRef,
    isModalVisibleForCalc,
    anchorElementRef,
    debouncedCalculatePosition,
  ])

  useEffect(() => {
    const modalElement = modalElementRef.current
    const anchorElement = anchorElementRef.current

    if (
      modalElement &&
      isModalVisibleForCalc &&
      anchorElement &&
      options.autoRepositionOnOverflow
    ) {
      const timeoutId = setTimeout(() => {
        calculateModalPosition(anchorElement, true, false)
      }, AUTO_REPOSITION_DELAY_MS)

      return () => clearTimeout(timeoutId)
    }
  }, [
    modalElementRef.current,
    isModalVisibleForCalc,
    options.autoRepositionOnOverflow,
    calculateModalPosition,
    anchorElementRef,
  ])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current)
      }
      if (mouseTransitTimeoutRef.current) {
        clearTimeout(mouseTransitTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!options.hovering) {
      setIsHoveringAnchor(false)
      setIsHoveringModal(false)
      setIsMouseInTransit(false)

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      if (hoverOpenTimeoutRef.current) {
        clearTimeout(hoverOpenTimeoutRef.current)
        hoverOpenTimeoutRef.current = null
      }
      if (mouseTransitTimeoutRef.current) {
        clearTimeout(mouseTransitTimeoutRef.current)
        mouseTransitTimeoutRef.current = null
      }
    }
  }, [options.hovering])

  // #endregion

  // #region Memos
  const direction = useMemo<PositionStrategy | undefined>(() => {
    if (modalPosition && modalPosition.bottom !== 'auto') {
      return 'top'
    }
    return options.positionStrategy?.[0]
  }, [modalPosition, options.positionStrategy])

  // #endregion

  return {
    status: {
      isShowModal: isModalVisible,
    },
    ref: {
      modalElement: modalElementRef,
      anchorElement: anchorElementRef,
    },
    controller: {
      modal: modalController,
      anchor: anchorController,
    },
    action: {
      closeModal,
      showModal,
      toggleShowModal,
    },
    layout: {
      position: modalPosition,
      direction,
      appliedSideFallback,
      sideArrowOffset,
      wasRepositioned: appliedSideFallback !== null || (direction !== undefined && direction !== options.positionStrategy?.[0]),
    },
  }
}
