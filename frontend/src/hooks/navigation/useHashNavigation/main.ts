import { useEffect } from 'react'

import { scrollToHash } from '../../../utils/element'

import type { HashNavigationOutput } from './types'

/**
 * @hook useHashNavigation
 * @description Scrolls to the section matching the current URL hash on mount, and provides a click
 * handler that intercepts same-page anchor navigation (href starting with "#") to reuse that same
 * smooth scroll instead of the browser's native jump.
 *
 * @output {Function} handleAnchorClick - Click handler factory: call with the anchor's href to get
 * an onClick handler for that anchor
 *
 * @returns {HashNavigationOutput} Object exposing handleAnchorClick
 *
 * @sideEffects
 * - Reads window.location.hash and scrolls on mount
 *
 * @example
 * const navigation = useHashNavigationOutput()
 *
 * <a href="#about" onClick={navigation.handleAnchorClick("#about")}>About</a>
 */
export const useHashNavigation = (): HashNavigationOutput => {
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash)
  }, [])

  const handleAnchorClick = (href: string) => (event: React.MouseEvent) => {
    if (!href.startsWith("#")) return
    event.preventDefault()
    scrollToHash(href)
  }

  return { handleAnchorClick }
}
