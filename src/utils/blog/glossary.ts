export const GLOSSARY_REFERENCE_PREFIX = "#glossary:"

const glossaryReferencePattern = /\]\(#glossary:([a-z0-9]+(?:-[a-z0-9]+)*)\)/g

export const normalizeGlossaryKey = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")

export const glossaryReference = (key: string) =>
  `${GLOSSARY_REFERENCE_PREFIX}${normalizeGlossaryKey(key)}`

export const extractGlossaryKeys = (markdown: string) => [
  ...new Set(Array.from(markdown.matchAll(glossaryReferencePattern), (match) => match[1])),
]

export const getGlossaryKeyFromHref = (href?: string) => {
  if (!href?.startsWith(GLOSSARY_REFERENCE_PREFIX)) return undefined

  const key = href.slice(GLOSSARY_REFERENCE_PREFIX.length)
  return key === normalizeGlossaryKey(key) ? key : undefined
}

