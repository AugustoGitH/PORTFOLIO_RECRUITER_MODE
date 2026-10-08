import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"
import { glossaryReference } from "@/utils/blog"
import type {
  GlossaryMention,
  GlossaryReferenceMatch,
  GlossarySuggestion,
  MarkdownEdit,
  MarkdownEditState,
} from "./types"

const referencePattern = /\[([^\]\n]*)\]\(#glossary:([a-z0-9]+(?:-[a-z0-9]+)*)\)/g
const codePattern = /```[\s\S]*?```|`[^`\n]+`/g
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const getGlossaryTranslation = (entry: AdminBlogGlossaryEntry, language: Language) =>
  entry.translations[language] ?? entry.translations.ptbr

const termsOf = (entry: AdminBlogGlossaryEntry, language: Language) => {
  const translation = getGlossaryTranslation(entry, language)
  return [translation.term, ...(translation.aliases ?? [])]
}

export const findGlossaryReferences = (markdown: string): GlossaryReferenceMatch[] =>
  Array.from(markdown.matchAll(referencePattern), (match) => ({
    start: match.index,
    end: match.index + match[0].length,
    label: match[1],
    key: match[2],
  }))

export const findReferenceAt = (markdown: string, start: number, end: number) =>
  findGlossaryReferences(markdown).find((reference) => start >= reference.start && end <= reference.end)

export const rankGlossary = (
  glossary: AdminBlogGlossaryEntry[],
  query: string,
  language: Language,
): GlossarySuggestion[] => {
  const normalized = query.trim().toLocaleLowerCase()

  return glossary
    .filter((entry) => entry.status === "active")
    .map((entry) => {
      const values = [entry.key, ...termsOf(entry, language)].map((value) => value.toLocaleLowerCase())
      const rank = !normalized ? 3
        : values.some((value) => value === normalized) ? 0
        : values.some((value) => value.startsWith(normalized)) ? 1
        : values.some((value) => value.includes(normalized)) ? 2
        : -1
      return { entry, rank }
    })
    .filter((item) => item.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.entry.key.localeCompare(b.entry.key))
    .map((item) => ({ entry: item.entry, exact: item.rank === 0 }))
}

export const findUnlinkedMentions = (
  markdown: string,
  glossary: AdminBlogGlossaryEntry[],
  language: Language,
  limit = 6,
): GlossaryMention[] => {
  const blocked = [
    ...findGlossaryReferences(markdown).map((reference) => [reference.start, reference.end]),
    ...Array.from(markdown.matchAll(codePattern), (match) => [match.index, match.index + match[0].length]),
  ]
  const mentions: GlossaryMention[] = []

  for (const entry of glossary) {
    if (entry.status !== "active") continue
    const terms = termsOf(entry, language).filter(Boolean).map(escapeRegExp)
    if (terms.length === 0) continue
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${terms.join("|")})(?![\\p{L}\\p{N}])`, "giu")

    for (const match of markdown.matchAll(pattern)) {
      const start = match.index
      const end = start + match[0].length
      if (blocked.some(([from, to]) => start < to && end > from)) continue
      mentions.push({ key: entry.key, term: getGlossaryTranslation(entry, language).term, text: match[0], start, end })
      break
    }
  }

  return mentions.sort((a, b) => a.start - b.start).slice(0, limit)
}

export const applyGlossaryReference = (
  state: MarkdownEditState,
  key: string,
  fallbackLabel: string,
): MarkdownEdit => {
  const existing = findReferenceAt(state.value, state.start, state.end)
  const raw = state.value.slice(state.start, state.end)
  const leading = raw.length - raw.trimStart().length
  const trailing = raw.length - raw.trimEnd().length
  const from = existing?.start ?? state.start + (raw.trim() ? leading : 0)
  const to = existing?.end ?? state.end - (raw.trim() ? trailing : 0)
  const label = existing?.label || state.value.slice(from, to) || fallbackLabel
  const citation = `[${label}](${glossaryReference(key)})`
  const cursor = from + citation.length

  return { value: state.value.slice(0, from) + citation + state.value.slice(to), start: cursor, end: cursor }
}

export const removeGlossaryReference = (
  state: MarkdownEditState,
  reference: GlossaryReferenceMatch,
): MarkdownEdit => ({
  value: state.value.slice(0, reference.start) + reference.label + state.value.slice(reference.end),
  start: reference.start,
  end: reference.start + reference.label.length,
})
