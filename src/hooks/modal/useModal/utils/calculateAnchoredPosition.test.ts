import { describe, expect, it } from 'vitest'
import { calculateAnchoredPosition } from './calculateAnchoredPosition'

const rect = (x: number, y: number, width: number, height: number) =>
  ({ x, y, width, height, left: x, top: y, right: x + width, bottom: y + height }) as DOMRect

const base = {
  viewport: { width: 390, height: 844 },
  modal: { width: 330, height: 106 },
  preferred: 'bottom' as const,
  origin: 'center' as const,
  padding: 16,
  offset: { top: 12, bottom: 4 },
}

// `left` carries the +width/2 that cancels the translateX(-50%) of the center origin.
const edgeOf = (result: ReturnType<typeof calculateAnchoredPosition>, width = 330) =>
  (result.position.left as number) - width / 2

describe('calculateAnchoredPosition', () => {
  it('centers the popover on the anchor and keeps the arrow in the middle when there is room', () => {
    const result = calculateAnchoredPosition({ ...base, anchorRect: rect(180, 400, 30, 30) })

    expect(result.direction).toBe('bottom')
    expect(result.position.top).toBe(434)
    expect(edgeOf(result)).toBe(30)
    expect(result.arrowOffset).toBe(165)
  })

  it('slides inside the viewport near the right edge while the arrow stays on the anchor', () => {
    const anchor = rect(321, 580, 15, 15)
    const result = calculateAnchoredPosition({ ...base, anchorRect: anchor })
    const left = edgeOf(result)

    expect(left + 330).toBe(390 - 16)
    expect(left + result.arrowOffset).toBeCloseTo(anchor.left + anchor.width / 2)
  })

  it('slides inside the viewport near the left edge while the arrow stays on the anchor', () => {
    const anchor = rect(30, 300, 20, 20)
    const result = calculateAnchoredPosition({ ...base, anchorRect: anchor })
    const left = edgeOf(result)

    expect(left).toBe(16)
    expect(left + result.arrowOffset).toBeCloseTo(40)
  })

  it('stops the arrow at the corner inset when the anchor is outside the popover padding', () => {
    const result = calculateAnchoredPosition({ ...base, anchorRect: rect(4, 300, 20, 20) })

    expect(edgeOf(result)).toBe(16)
    expect(result.arrowOffset).toBe(12)
  })

  it('flips to the opposite side instead of covering the anchor', () => {
    const anchor = rect(160, 760, 40, 24)
    const result = calculateAnchoredPosition({ ...base, anchorRect: anchor })

    expect(result.direction).toBe('top')
    expect((result.position.top as number) + base.modal.height).toBe(anchor.top - base.offset.top)
  })

  it('opens below a glossary term near the top and reports that it did', () => {
    const result = calculateAnchoredPosition({
      ...base,
      modal: { width: 330, height: 205 },
      preferred: 'top',
      anchorRect: rect(165, 42, 58, 27),
    })

    expect(result.direction).toBe('bottom')
    expect(result.position.top).toBe(42 + 27 + base.offset.bottom)
  })

  it('goes to a side when neither above nor below fits, vertically centered on the anchor', () => {
    const result = calculateAnchoredPosition({
      ...base,
      viewport: { width: 800, height: 390 },
      modal: { width: 300, height: 205 },
      anchorRect: rect(100, 180, 30, 30),
    })

    expect(result.direction).toBe('right')
    expect(edgeOf(result, 300)).toBe(130 + base.offset.bottom)
    expect(result.arrowOffset).toBeCloseTo(195 - (result.position.top as number))
  })

  it('never lets the arrow leave the popover edge', () => {
    const result = calculateAnchoredPosition({ ...base, anchorRect: rect(375, 300, 12, 12) })

    expect(result.arrowOffset).toBeLessThanOrEqual(330 - 12)
    expect(result.arrowOffset).toBeGreaterThanOrEqual(12)
  })

  it('does not compensate the center transform for other origins', () => {
    const result = calculateAnchoredPosition({ ...base, origin: 'left', anchorRect: rect(20, 300, 20, 20) })

    expect(result.position.left).toBe(20)
  })
})
