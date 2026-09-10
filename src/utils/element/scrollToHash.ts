const DURATION = 600

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

/**
 * Smoothly scrolls to a same-page section given its hash (e.g. "#about").
 *
 * The animation is driven manually via requestAnimationFrame instead of relying
 * on native smooth scrolling (`scroll-behavior: smooth` / `behavior: "smooth"`),
 * which is unreliable on Chromium/Windows — fragment navigation often jumps or
 * does nothing there. Each frame applies an instant scroll, so the easing is
 * fully under our control and works consistently across browsers and OSes.
 *
 * The offset comes from the `--scroll-offset` CSS variable so it stays in sync
 * with `scroll-padding-top` and accounts for the sticky Header.
 */
export const scrollToHash = (hash: string) => {
  const id = hash.replace(/^#/, "")
  const target = document.getElementById(id)

  if (!target) return

  const rootStyle = getComputedStyle(document.documentElement)
  const offset = parseInt(rootStyle.getPropertyValue("--scroll-offset"), 10) || 0

  const start = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const destination = target.getBoundingClientRect().top + start - offset
  const end = Math.max(0, Math.min(destination, maxScroll))
  const distance = end - start

  history.pushState(null, "", hash)

  if (Math.abs(distance) < 1) return

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    window.scrollTo(0, end)
    return
  }

  let startTime: number | null = null

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp

    const progress = Math.min((timestamp - startTime) / DURATION, 1)
    const nextTop = start + distance * easeInOutQuad(progress)

    // Instant per-frame scroll: we own the easing, so the browser must not
    // re-animate it (which would fight this loop on smooth-scroll browsers).
    window.scrollTo({ top: nextTop, behavior: "instant" as ScrollBehavior })

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}
