export type OnceInViewOptions = {
  /** Fraction of the element that must be visible to count as intersecting. @default 0.2 */
  threshold?: number
  /** Passed through to IntersectionObserver, e.g. to trigger slightly before/after the viewport edge. @default "0px" */
  rootMargin?: string
}

export type OnceInViewOutput<Element extends HTMLElement> = {
  ref: React.RefObject<Element | null>
  inView: boolean
}
