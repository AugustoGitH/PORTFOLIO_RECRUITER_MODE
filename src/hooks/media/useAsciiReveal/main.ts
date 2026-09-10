import { useEffect, useMemo, useState } from 'react'

import { RAMP, type AsciiRow, type AsciiRun } from '../../../utils/ascii'

import type { AsciiChar, AsciiRevealInput, AsciiRevealOutput } from './types'

/** Delay before the bottom row starts resolving/animating. */
const MIN_DELAY_MS = 120

/** Time the wave takes to travel from the bottom row to the top one. */
const WAVE_SPAN_MS = 800

/** Total time any variant's reveal takes, top row included — also when the idle shimmer arms. */
const REVEAL_TOTAL_MS = MIN_DELAY_MS + WAVE_SPAN_MS

/** How often "decode" refreshes unresolved rows with a fresh random glyph. */
const DECODE_TICK_MS = 60

/** How often the settled idle shimmer refreshes its batch of nudged glyphs. */
const IDLE_TICK_MS = 160

/** How many cells get nudged per idle tick. Scattered across the whole grid, so at this rate the
 * eye keeps catching motion somewhere without any single spot flickering on every tick. */
const IDLE_PULSES_PER_TICK = 6

/** Delay before a row starts resolving: bottom row (last index) first, top row last. Shared by
 * all three variants so they read as the same underlying wave. */
const waveDelay = (rowIndex: number, rowCount: number) => {
  const distanceFromBottom = rowCount - 1 - rowIndex
  const progress = rowCount > 1 ? distanceFromBottom / (rowCount - 1) : 1

  return MIN_DELAY_MS + progress * WAVE_SPAN_MS
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

const randomGlyph = () => RAMP[Math.floor(Math.random() * RAMP.length)]
const pickRandomInt = (max: number) => Math.floor(Math.random() * max)

const scrambleRun = (run: AsciiRun): AsciiRun =>
  run.tone === "blank" ? run : { ...run, text: Array.from(run.text, randomGlyph).join("") }

const shiftGlyph = (char: string, delta: number) => {
  const index = RAMP.indexOf(char)

  return index === -1 ? char : RAMP[Math.min(RAMP.length - 1, Math.max(0, index + delta))]
}

/** Fresh id for every pulse, so using it as a React key forces the touched cell to remount and
 * replay its CSS pop animation instead of silently updating text on the same node. */
let pulseSeq = 0

/** Nudges one random non-blank character one step up/down the density ramp, isolating it into
 * its own tiny run so the component can pop it (scale + lift) independently of its neighbors. */
const perturbOneCell = (rows: AsciiRow[]): AsciiRow[] => {
  for (let attempt = 0; attempt < 6; attempt++) {
    const rowIndex = pickRandomInt(rows.length)
    const row = rows[rowIndex]
    const runIndex = pickRandomInt(row.length)
    const run = row[runIndex]

    if (run.tone === "blank" || run.text.length === 0) continue

    const charIndex = pickRandomInt(run.text.length)
    const nextChar = shiftGlyph(run.text[charIndex], Math.random() < 0.5 ? -1 : 1)

    if (nextChar === run.text[charIndex]) continue

    const before = run.text.slice(0, charIndex)
    const after = run.text.slice(charIndex + 1)

    const splitRuns: AsciiRun[] = [
      ...(before ? [{ text: before, tone: run.tone }] : []),
      { text: nextChar, tone: run.tone, pulseId: ++pulseSeq },
      ...(after ? [{ text: after, tone: run.tone }] : []),
    ]

    const nextRow = row.slice(0, runIndex).concat(splitRuns, row.slice(runIndex + 1))
    const nextRows = rows.slice()
    nextRows[rowIndex] = nextRow
    return nextRows
  }

  return rows
}

/** Re-derived from the pristine base grid on every tick (not from the previous tick's output),
 * so the shimmer never drifts away from the source image — it always self-reverts. */
const perturbRows = (baseRows: AsciiRow[]): AsciiRow[] => {
  let rows = baseRows

  for (let i = 0; i < IDLE_PULSES_PER_TICK; i++) rows = perturbOneCell(rows)

  return rows
}

/** Same idea as `perturbOneCell`, for the flat character list the "converge" variant renders —
 * no splitting needed there since every character already has its own element. */
const perturbOneChar = (chars: AsciiChar[]): AsciiChar[] => {
  for (let attempt = 0; attempt < 6; attempt++) {
    const index = pickRandomInt(chars.length)
    const current = chars[index]
    const nextChar = shiftGlyph(current.char, Math.random() < 0.5 ? -1 : 1)

    if (nextChar === current.char) continue

    const next = chars.slice()
    next[index] = { ...current, char: nextChar, pulseId: ++pulseSeq }
    return next
  }

  return chars
}

const perturbChars = (baseChars: AsciiChar[]): AsciiChar[] => {
  let chars = baseChars

  for (let i = 0; i < IDLE_PULSES_PER_TICK; i++) chars = perturbOneChar(chars)

  return chars
}

const buildChars = (rows: AsciiRow[], cell: { width: number; height: number }): AsciiChar[] => {
  const rowCount = rows.length
  const chars: AsciiChar[] = []

  rows.forEach((row, rowIndex) => {
    let column = 0
    const baseDelay = waveDelay(rowIndex, rowCount)

    row.forEach((run, runIndex) => {
      Array.from(run.text).forEach((char, charOffset) => {
        if (run.tone !== "blank") {
          const finalX = (column + charOffset) * cell.width
          const finalY = rowIndex * cell.height
          // Each character scatters around its OWN final spot rather than the block's center,
          // so it reads as nearby fragments swirling into place, not a single burst from one side.
          const angle = Math.random() * Math.PI * 2
          const radius = cell.width * (6 + Math.random() * 10)

          chars.push({
            key: `${rowIndex}-${runIndex}-${charOffset}`,
            char,
            tone: run.tone,
            finalX,
            finalY,
            startX: finalX + Math.cos(angle) * radius,
            startY: finalY + Math.sin(angle) * radius,
            startRotation: (Math.random() - 0.5) * 50,
            delayMs: baseDelay + Math.random() * 60,
          })
        }
      })

      column += run.text.length
    })
  })

  return chars
}

/** True once `totalMs` have passed since `play` first became true. Gates the idle shimmer so it
 * only starts once the reveal itself has visibly settled. */
const useSettled = (play: boolean, totalMs: number) => {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!play) return

    const timeout = setTimeout(() => setSettled(true), totalMs)
    return () => clearTimeout(timeout)
  }, [play, totalMs])

  return settled
}

/** Mirrors `baseRows` until `active`, then applies the idle shimmer on top of it. Resets the
 * mirror synchronously during render when `baseRows` changes (React's documented pattern for
 * deriving state from a prop) instead of an effect, which would cost an extra render pass. */
const useIdleRows = (baseRows: AsciiRow[] | null, active: boolean): AsciiRow[] | null => {
  const [trackedBase, setTrackedBase] = useState(baseRows)
  const [rows, setRows] = useState(baseRows)

  if (baseRows !== trackedBase) {
    setTrackedBase(baseRows)
    setRows(baseRows)
  }

  useEffect(() => {
    if (!active || !baseRows || prefersReducedMotion()) return

    const interval = setInterval(() => setRows(perturbRows(baseRows)), IDLE_TICK_MS)
    return () => clearInterval(interval)
  }, [active, baseRows])

  return rows
}

const useIdleChars = (baseChars: AsciiChar[] | null, active: boolean): AsciiChar[] | null => {
  const [trackedBase, setTrackedBase] = useState(baseChars)
  const [chars, setChars] = useState(baseChars)

  if (baseChars !== trackedBase) {
    setTrackedBase(baseChars)
    setChars(baseChars)
  }

  useEffect(() => {
    if (!active || !baseChars || prefersReducedMotion()) return

    const interval = setInterval(() => setChars(perturbChars(baseChars)), IDLE_TICK_MS)
    return () => clearInterval(interval)
  }, [active, baseChars])

  return chars
}

/** "decode": every glyph flickers through random ramp characters until it locks in, bottom row
 * first. Cheapest variant — only run strings mutate, nothing moves. */
const useDecodeReveal = (target: AsciiRow[] | null, play: boolean) => {
  const [rows, setRows] = useState<AsciiRow[] | null>(null)

  useEffect(() => {
    if (!play || !target) return

    if (prefersReducedMotion()) {
      // Deferred a frame (rather than set synchronously here) to keep this effect's only
      // direct setState calls inside a callback, not the effect body itself.
      const frame = requestAnimationFrame(() => setRows(target))
      return () => cancelAnimationFrame(frame)
    }

    const rowCount = target.length
    const start = performance.now()

    const tick = () => {
      const elapsed = performance.now() - start

      setRows(target.map((row, rowIndex) => (elapsed >= waveDelay(rowIndex, rowCount) ? row : row.map(scrambleRun))))

      if (elapsed >= REVEAL_TOTAL_MS) clearInterval(interval)
    }

    tick()
    const interval = setInterval(tick, DECODE_TICK_MS)

    return () => clearInterval(interval)
  }, [play, target])

  return useIdleRows(rows, useSettled(play, REVEAL_TOTAL_MS))
}

/** "sweep": each row slides up and fades in, bottom row first. Pure CSS (transform/opacity) —
 * the hook only computes per-row delays, the component drives the actual transition. */
const useSweepReveal = (target: AsciiRow[] | null, play: boolean) => {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!play || !target) return

    // Mount in the "before" state first, then flip on the next frame — CSS transitions only
    // fire on a style change after mount, not on the initial render.
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [play, target])

  const rowDelay = useMemo(
    () => (target ? target.map((_, rowIndex) => waveDelay(rowIndex, target.length)) : []),
    [target]
  )

  const rows = useIdleRows(target, useSettled(play, REVEAL_TOTAL_MS))

  return { rows, revealed, rowDelay }
}

/** "converge": every character starts scattered near its own final cell and flies into place,
 * bottom rows first. One element per character — by far the priciest variant. */
const useConvergeReveal = (target: AsciiRow[] | null, play: boolean, cell?: { width: number; height: number }) => {
  const baseChars = useMemo(() => (target && cell ? buildChars(target, cell) : null), [target, cell])
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!play || !baseChars) return

    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [play, baseChars])

  const chars = useIdleChars(baseChars, useSettled(play, REVEAL_TOTAL_MS))

  return { chars, revealed }
}

/**
 * @hook useAsciiReveal
 * @description Single entry point for how an ASCII grid appears on screen. Three interchangeable
 * reveal strategies share the same bottom-to-top wave timing (see AsciiRevealVariant for what
 * each looks like); once a reveal settles, a shared idle shimmer keeps a handful of random
 * glyphs popping across the grid so the block never sits perfectly static afterwards.
 *
 * @param {AsciiRevealInput} input - Target grid, the flag that starts the reveal, and the chosen variant
 *
 * @returns {AsciiRevealOutput} Discriminated union matching `input.variant`
 *
 * @sideEffects
 * - Runs interval/timeout/rAF loops while the reveal, and afterwards the idle shimmer, are active
 *
 * @example
 * const ascii = useAsciiReveal({ rows: target, play: inView, variant: "decode" })
 */
export const useAsciiReveal = (input: AsciiRevealInput): AsciiRevealOutput => {
  const decodeRows = useDecodeReveal(input.rows, input.play && input.variant === "decode")
  const sweep = useSweepReveal(input.rows, input.play && input.variant === "sweep")
  const converge = useConvergeReveal(input.rows, input.play && input.variant === "converge", input.cell)

  if (input.variant === "sweep") {
    return { variant: "sweep", rows: sweep.rows, revealed: sweep.revealed, rowDelay: sweep.rowDelay }
  }

  if (input.variant === "converge") {
    return { variant: "converge", chars: converge.chars, revealed: converge.revealed }
  }

  return { variant: "decode", rows: decodeRows }
}
