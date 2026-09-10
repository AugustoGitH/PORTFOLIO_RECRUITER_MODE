import { createPortal } from 'react-dom'

import { setDefaultProps } from '../../../utils/preset'
import { buildSelector } from '../../../utils/selector'
import { slug } from '../../../utils/string'
import { cn } from '../../../utils/tailwind'

import type { PopoverProps } from './types'
import { popoverVariant } from './variants'
import { usePopover } from './hooks'

/**
 * @component Popover
 * @description Positioned content overlay anchored to a reference element, rendered through a
 * React portal to escape z-index/overflow clipping. Supports origins, directions, an optional
 * arrow, hover and click triggers, click-outside detection and viewport-aware repositioning.
 *
 * Ported from the source design system. Two source-only dependencies were swapped for this
 * project's conventions: `tailwind-variants` → `cn()` + inline (see `./variants`), and the
 * HeadlessUI enter/leave `Transition` → a lightweight CSS fade (`animate-fade-in`). The leave
 * transition never rendered in the original anyway, since the portal unmounts on close.
 *
 * @example
 * const ref = useRef<HTMLButtonElement>(null)
 * <Popover name="help" anchor={{ ref, element: (s) => <button ref={ref} onClick={s.onShow}>?</button> }}>
 *   {() => <p className="p-2 text-xs">Content</p>}
 * </Popover>
 */
export const Popover = <A extends HTMLElement = HTMLElement>(
  _props: PopoverProps<A>
) => {
  const props = setDefaultProps(_props, {
    origin: 'center',
    fullWidth: false,
    show: false,
    direction: 'bottom',
  })

  const popover = usePopover(props)

  const styles = popoverVariant({
    direction: popover.variants.direction,
    origin: popover.variants.origin,
  })

  // Show the arrow whenever it's requested. The arrow's direction/offset is
  // recomputed from the *effective* placement (popover.variants.direction, which
  // already accounts for side fallbacks and vertical flips), so it always points
  // at the anchor. The old `!wasRepositioned` guard suppressed the arrow for every
  // side-positioned popover (direction left/right sets appliedSideFallback), which
  // is why arrows never rendered on lateral popovers.
  const shouldShowArrow = Boolean(props.arrow)

  const content = (
    <div // content
      {...(props.paperProps ?? {})}
      className={cn(styles.content, 'animate-fade-in', props.paperProps?.className)}
    >
      {popover.render.children}
    </div>
  )

  return (
    <div className='relative contents'>
      {popover.render.anchorElement}
      {popover.modal.status.isShowModal &&
        createPortal(
          <div // wrapper
            data-testid={slug(buildSelector('Popover'), props.name)}
            ref={popover.modal.ref.modalElement}
            {...(props.boxProps ?? {})}
            className={cn(styles.wrapper, props.boxProps?.className)}
            role='popover'
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            {...popover.modal.controller.modal()}
          >
            {shouldShowArrow && (
              <div // arrow
                {...(props.arrowProps ?? {})}
                className={cn(styles.arrow, props.arrowProps?.className)}
                style={
                  popover.variants.sideArrowOffset !== undefined
                    ? { top: `${popover.variants.sideArrowOffset}px`, '--tw-translate-y': '-50%' } as React.CSSProperties
                    : undefined
                }
              />
            )}
            {props.hovering ? (
              <div className='relative p-2 -m-2'>{content}</div>
            ) : (
              content
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
