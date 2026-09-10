import { useEffect, useState } from 'react'

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
export const useHashNavigation = (sectionHrefs: readonly string[] = []): HashNavigationOutput => {
  const [activeHref, setActiveHref] = useState<string>()

  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash)
  }, [])

  useEffect(() => {
    if (!sectionHrefs.length) return

    const updateActiveSection = () => {
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--scroll-offset"), 10) || 0
      const readingLine = Math.max(offset, window.innerHeight * 0.4)
      const isAtPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1

      if (isAtPageEnd) {
        setActiveHref(sectionHrefs.at(-1))
        return
      }

      const passedSections = sectionHrefs.filter(href => {
        const section = document.getElementById(href.slice(1))
        return section && section.getBoundingClientRect().top <= readingLine
      })

      setActiveHref(passedSections.at(-1) ?? sectionHrefs[0])
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [sectionHrefs])

  const handleAnchorClick = (href: string) => (event: React.MouseEvent) => {
    if (!href.startsWith("#")) return
    event.preventDefault()
    setActiveHref(href)
    scrollToHash(href)
  }

  return { handleAnchorClick, activeHref }
}
