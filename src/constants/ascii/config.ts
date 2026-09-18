/** Density ramp, heaviest glyph first. Blank cells are handled separately. */
export const RAMP = "█▓▒░*+=-:."

/**
 * Advance width divided by line height of a monospace glyph. The row count and the
 * font size are both derived from it, so the character grid reproduces the source
 * aspect ratio instead of stretching it vertically.
 */
export const CHAR_ASPECT = 0.6

/**
 * Ink coverage at which a cell is already considered fully drawn: it gets the heaviest
 * glyph and the ink color, and anything below it is a partial stroke in the accent color,
 * with a glyph proportional to how much of the cell the stroke fills.
 *
 * The source images are line art, so coverage is what has to be stretched rather than
 * averaged: a stroke one pixel wide barely moves the average of a cell several pixels
 * across, which is what turned eyes, mouth and moustache into the faintest glyph in the
 * ramp — present, but invisible.
 */
export const SOLID_INK = 0.22

/** At or below this coverage a cell is background and renders as a space. */
export const BLANK_INK = 0.04
