export const DEFAULT_COLUMNS = 120
export const DEFAULT_VARIANT = "decode"

export const ACCENT = "text-ud-auxiliary-purple"
export const TRANSITION = "transition-all duration-500 ease-out motion-reduce:transition-none"
// "inline-block" so transform actually applies (inline boxes ignore it); only needed on the
// cell an idle tick just touched, everything else stays a plain inline span.
export const PULSE = "inline-block animate-glyph-pop motion-reduce:animate-none"

