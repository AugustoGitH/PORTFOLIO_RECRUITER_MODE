import { useEffect, useRef } from 'react'

import { useStableRef } from '../../state'
import { setDefaultProps } from '../../../utils/preset'

import type { OutsideTriggerOptions } from './types'

/**
 * @hook useOutsideTrigger
 * @description Detects clicks outside a referenced element and triggers a callback. Useful for closing modals, dropdowns, and popovers when clicking outside.
 *
 * @template Element - HTML element type for the ref (defaults to HTMLDivElement)
 *
 * @param {OutsideTriggerOptions} _options - Configuration options
 * @param {Function} [_options.onOutsideClick] - Callback fired when click occurs outside element
 * @param {Function|boolean} [_options.shouldTrigger] - Condition to check before triggering (function receives clicked node and target element)
 *
 * @output {RefObject} ref - Ref to attach to the element to monitor
 *
 * @returns {[RefObject<Element>]} Tuple containing the element ref
 *
 * @sideEffects
 * - Attaches mousedown listener to document
 * - Removes listener on unmount
 *
 * @example
 * const [containerRef] = useOutsideTrigger({
 *   onOutsideClick: () => setIsOpen(false),
 *   shouldTrigger: (node, element) => !anchorRef.current?.contains(node)
 * })
 *
 * <div ref={containerRef}>
 *   Content
 * </div>
 *
 * @features
 * - Configurable trigger condition (function or boolean)
 * - Stable event listener (no re-subscription on options change)
 * - Generic element type support
 */
export const useOutsideTrigger = <Element extends HTMLElement = HTMLDivElement>(
  _options: OutsideTriggerOptions
) => {
  const options = setDefaultProps(_options, {
    shouldTrigger: true,
  } as OutsideTriggerOptions)

  const elementRef = useRef<Element>(null)
  const optionsRef = useStableRef(options)

  useEffect(() => {
    const handleEvent = (event: MouseEvent) => {
      // Use the ref to get the latest options without causing re-subscription
      const currentOptions = optionsRef.current;

      const isOutside =
        typeof currentOptions.shouldTrigger === 'function'
          ? currentOptions.shouldTrigger(event.target as Node, elementRef.current)
          : currentOptions.shouldTrigger

      const isInElement =
        elementRef.current && elementRef.current.contains(event.target as Node);

      if (!isInElement && isOutside) {
        currentOptions.onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleEvent)

    return () => {
      document.removeEventListener('mousedown', handleEvent)
    }
  }, [optionsRef])

  return [elementRef]
}
