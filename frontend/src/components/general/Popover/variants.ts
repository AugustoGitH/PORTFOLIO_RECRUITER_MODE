import { cn } from '../../../utils/tailwind'
import type { PopoverDirection, PopoverOrigin } from './types'

/**
 * Styling for the Popover, ported from the source project's `tailwind-variants`
 * definition to this project's plain `cn()` convention.
 *
 * - wrapper: outer portal container
 * - content: bordered/shadowed content box
 * - arrow: optional indicator, positioned by `direction` + `origin`
 *
 * The `direction: left|right` compound overrides the horizontal placement the
 * `origin` would otherwise apply (matching the original `compoundVariants`).
 */
type PopoverVariantParams = {
  direction?: PopoverDirection
  origin?: PopoverOrigin
}

const ARROW_BY_DIRECTION: Record<PopoverDirection, string> = {
  bottom: 'border-t border-l -top-1',
  top: 'border-b border-r -bottom-1',
  // Tooltip on the left, arrow points right (sits on the right edge)
  left: 'border-t border-r -right-1 top-1/2 -translate-y-1/2',
  // Tooltip on the right, arrow points left (sits on the left edge)
  right: 'border-b border-l -left-1 top-1/2 -translate-y-1/2',
}

const ARROW_BY_ORIGIN: Record<PopoverOrigin, string> = {
  left: 'left-3',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-3',
  'sub-left': 'left-6',
  'sub-right': 'right-6',
}

// When direction is left/right, override origin's horizontal positioning.
const ARROW_SIDE_COMPOUND: Partial<Record<PopoverDirection, string>> = {
  left: '!left-auto !-right-1 !translate-x-0',
  right: '!right-auto !-left-1 !translate-x-0',
}

export const popoverVariant = ({ direction = 'bottom', origin = 'center' }: PopoverVariantParams) => ({
  wrapper: 'w-fit z-popover overflow-visible',
  content:
    'p-1 w-full origin-top-right rounded-md  shadow-lg focus:outline-none border z-popover overflow-visible bg-ud-neutral-0 border-ud-neutral-300',
  arrow: cn(
    'absolute w-2 h-2 rotate-45 border-ud-neutral-300 bg-ud-neutral-0 z-10',
    ARROW_BY_DIRECTION[direction],
    ARROW_BY_ORIGIN[origin],
    ARROW_SIDE_COMPOUND[direction],
  ),
})
