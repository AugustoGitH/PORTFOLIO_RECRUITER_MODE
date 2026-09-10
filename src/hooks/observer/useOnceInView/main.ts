import { useEffect, useRef, useState } from 'react'

import { setDefaultProps } from '../../../utils/preset'

import type { OnceInViewOptions, OnceInViewOutput } from './types'

/**
 * @hook useOnceInView
 * @description Reports whether a referenced element has entered the viewport. The observer
 * disconnects on the first intersection and `inView` never goes back to false afterwards, so
 * this is meant for one-shot reveal animations (fade/reveal on scroll), not live visibility
 * tracking.
 *
 * @template Element - HTML element type for the ref (defaults to HTMLDivElement)
 *
 * @param {OnceInViewOptions} [_options] - threshold / rootMargin passed through to IntersectionObserver
 *
 * @output {RefObject} ref - Ref to attach to the observed element
 * @output {boolean} inView - True once the element has intersected the viewport
 *
 * @returns {OnceInViewOutput<Element>} Object exposing ref and inView
 *
 * @sideEffects
 * - Creates an IntersectionObserver on mount; disconnects it after the first intersection or on unmount
 *
 * @example
 * const { ref, inView } = useOnceInView<HTMLDivElement>({ threshold: 0.3 })
 *
 * <div ref={ref}>{inView && <RevealedContent />}</div>
 */
export const useOnceInView = <Element extends HTMLElement = HTMLDivElement>(
  _options: OnceInViewOptions = {}
): OnceInViewOutput<Element> => {
  const options = setDefaultProps(_options, {
    threshold: 0.2,
    rootMargin: "0px",
  } as OnceInViewOptions)

  // #region Refs
  const ref = useRef<Element>(null)

  // #endregion

  // #region States
  const [inView, setInView] = useState(false)

  // #endregion

  // #region Effects
  useEffect(() => {
    const element = ref.current

    if (!element || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setInView(true)
        observer.disconnect()
      },
      { threshold: options.threshold, rootMargin: options.rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [inView, options.threshold, options.rootMargin])

  // #endregion

  return { ref, inView }
}
