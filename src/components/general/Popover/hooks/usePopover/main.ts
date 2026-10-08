/* eslint-disable react-hooks/set-state-in-effect -- registration state is synchronized with the external popover stack. */
import { useCallback, useEffect, useId, useMemo, useState } from 'react'

import { usePopoverContext } from '../../providers/popover'
import { useModal } from '../../../../../hooks/modal'
import type { PositionStrategy } from '../../../../../hooks/modal'
import type { ChildrenRenderer } from '../../../../../utils/types'

import type { PopoverProps, PopoverState } from '../../types'

/**
 * @hook usePopover
 * @description Manages popover positioning, visibility, and z-index stacking. Wraps useModal with popover-specific features like direction support and automatic anchor hover handling.
 *
 * @template A - Anchor element type (extends HTMLElement)
 *
 * @param {PopoverProps<A>} props - Popover configuration
 * @param {boolean} [props.show] - External control for popover visibility
 * @param {RefObject<A>} props.anchor.ref - Ref to the anchor element
 * @param {ChildrenRenderer} [props.anchor.element] - Anchor element renderer
 * @param {ChildrenRenderer} props.children - Popover content renderer
 * @param {'top'|'bottom'|'left'|'right'} [props.direction='bottom'] - Popover direction from anchor
 * @param {'center'|'left'|'right'} [props.origin] - Horizontal alignment origin
 * @param {boolean} [props.hovering] - Enable hover-triggered show/hide
 * @param {boolean} [props.autoRepositionOnOverflow] - Auto-adjust position on viewport overflow
 *
 * @output {number} status.popoverZIndex - Current z-index for stacking
 * @output {Object} modal - Extended modal instance with custom controller
 * @output {JSX.Element} render.children - Rendered children with state
 * @output {JSX.Element|null} render.anchorElement - Rendered anchor element
 * @output {string} variants.direction - Effective direction after fallback
 * @output {string|undefined} variants.origin - Origin for arrow positioning
 * @output {string|null} variants.appliedSideFallback - Applied side fallback direction
 * @output {number|undefined} variants.sideArrowOffset - Offset for side arrow positioning
 *
 * @returns {Object} Popover state, modal instance, render helpers, and variant props
 *
 * @example
 * const popover = usePopover({
 *   anchor: { ref: buttonRef },
 *   direction: 'bottom',
 *   children: <Menu />,
 * })
 *
 * @features
 * - Z-index stacking via PopoverContext
 * - Automatic hover event binding to anchor
 * - Direction-based positioning (top/bottom/left/right)
 * - Side fallback with arrow offset calculation
 */

type Direction = 'top' | 'bottom' | 'left' | 'right'

const isValidDirection = (
  direction: PositionStrategy | undefined
): direction is Direction => {
  return direction === 'top' || direction === 'bottom' || direction === 'left' || direction === 'right'
}

const getPositionStrategy = (direction: Direction | undefined): PositionStrategy[] => {
  switch (direction) {
    case 'top':
      return ['top']
    case 'left':
      return ['left']
    case 'right':
      return ['right']
    default:
      return ['bottom']
  }
}

export const usePopover = <A extends HTMLElement = HTMLElement>(
  props: PopoverProps<A>
) => {
  // #region Context
  const { activatePopover, deactivatePopover, registerPopover, unregisterPopover } = usePopoverContext()

  // #endregion

  // #region States
  const [popoverId, setPopoverId] = useState<string | null>(null)
  const [popoverZIndex, setPopoverZIndex] = useState(10000)
  const popoverInstanceId = useId()
  const onClose = props.onClose

  // #endregion

  const handleClose = useCallback(() => {
    deactivatePopover(popoverInstanceId)
    onClose?.()
  }, [deactivatePopover, onClose, popoverInstanceId])

  // #region Custom Hooks
  const modal = useModal<A, HTMLDivElement>({
    show: props.show,
    onShow: props.onShow,
    onClose: handleClose,
    anchorRef: props.anchor.ref,
    origin: props.origin,
    fullWidth: props.fullWidth,
    hovering: props.hovering,
    hoverGapTolerance: props.hoverGapTolerance,
    hoverOpenDelay: props.hoverOpenDelay,
    hoverCloseDelay: props.hoverCloseDelay,
    allowModalHover: props.allowModalHover,
    persistOnManualOpen: props.persistOnManualOpen,
    disableOutsideClick: props.disableOutsideClick,
    wrapperSelector: props.wrapperSelector,
    autoRepositionOnOverflow: props.autoRepositionOnOverflow,
    overflowPadding: props.overflowPadding,
    smartPositioning: props.smartPositioning,
    positionStrategy: getPositionStrategy(props.direction),
  })
  const { closeModal, showModal, toggleShowModal } = modal.action

  // #endregion

  // #region Callbacks
  const applyState = useCallback(
    (element: ChildrenRenderer<PopoverState<A>>) => {
      if (typeof element !== 'function') return element

      const stableState = {
        onShow: (event?: React.MouseEvent<A>) => {
          activatePopover(popoverInstanceId, closeModal)
          showModal(event)
        },
        onClose: closeModal,
        show: modal.status.isShowModal,
        onToggleShow: (event?: React.MouseEvent<A>) => {
          if (!modal.status.isShowModal) {
            activatePopover(popoverInstanceId, closeModal)
          }
          toggleShowModal(event)
        },
      }

      return element(stableState)
    },
    // Stable dependencies, without including the complete state object
    [
      toggleShowModal,
      modal.status.isShowModal,
      closeModal,
      showModal,
      activatePopover,
      popoverInstanceId,
    ]
  )

  // #endregion

  // #region Memos
  const children = useMemo(
    () => applyState(props.children),
    [props.children, applyState]
  )

  const anchorElement = useMemo(
    () => (props.anchor.element ? applyState(props.anchor.element) : null),
    [props.anchor.element, applyState]
  )

  // #endregion

  // #region Controllers
  const customModalController = () => {
    const modalProps = modal.controller.modal()
    return {
      ...modalProps,
      style: {
        ...(modalProps.style ?? {}),
        zIndex: Math.max(popoverZIndex, 10000),
      },
    }
  }

  // #edregion

  // #region Effects
  useEffect(() => {
    if (modal.status.isShowModal && !popoverId) {
      const { popoverId: newId, zIndex } = registerPopover()
      setPopoverId(newId)
      setPopoverZIndex(zIndex)
    } else if (!modal.status.isShowModal && popoverId) {
      unregisterPopover(popoverId)
      setPopoverId(null)
    }
  }, [modal.status.isShowModal, popoverId, registerPopover, unregisterPopover])

  useEffect(() => {
    return () => {
      if (popoverId) {
        unregisterPopover(popoverId)
      }
    }
  }, [popoverId, unregisterPopover])

  // Apply anchor controller automatically for hover functionality
  useEffect(() => {
    const anchorElement = props.anchor.ref.current
    if (!anchorElement || !props.hovering) return

    const controllers = modal.controller.anchor()

    // Create wrappers to convert React handlers to native EventListeners
    const handleMouseEnter = (event: Event) => {
      if (controllers.onMouseEnter) {
        controllers.onMouseEnter(event as unknown as React.MouseEvent<A>)
      }
    }

    const handleMouseLeave = (event: Event) => {
      if (controllers.onMouseLeave) {
        controllers.onMouseLeave(event as unknown as React.MouseEvent<A>)
      }
    }

    // Apply hover handlers if hovering is enabled
    if (controllers.onMouseEnter) {
      anchorElement.addEventListener('mouseenter', handleMouseEnter)
    }
    if (controllers.onMouseLeave) {
      anchorElement.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (controllers.onMouseEnter) {
        anchorElement.removeEventListener('mouseenter', handleMouseEnter)
      }
      if (controllers.onMouseLeave) {
        anchorElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [props.hovering, props.anchor.ref, modal.controller])
  // #endregion

  // Determine effective direction based on side fallback
  const effectiveDirection = (() => {
    // If side fallback was applied, use that as direction for arrow positioning
    if (modal.layout.appliedSideFallback) {
      return modal.layout.appliedSideFallback
    }
    // Otherwise use normal direction logic
    return isValidDirection(modal.layout.direction)
      ? modal.layout.direction
      : (props.direction ?? 'bottom')
  })()

  return {
    status: {
      popoverZIndex,
    },
    modal: {
      ...modal,
      controller: {
        ...modal.controller,
        modal: customModalController,
      },
    },
    render: {
      children,
      anchorElement,
    },
    variants: {
      direction: effectiveDirection,
      // When side fallback is applied, don't use origin for arrow positioning
      // (origin is for vertical positioning, not horizontal side positioning)
      origin: modal.layout.appliedSideFallback ? undefined : props.origin,
      appliedSideFallback: modal.layout.appliedSideFallback,
      sideArrowOffset: modal.layout.sideArrowOffset,
      wasRepositioned: modal.layout.wasRepositioned,
    },
  }
}
