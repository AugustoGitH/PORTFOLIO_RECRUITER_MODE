import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"

export type MarkdownEditorProps = {
  markdown: string
  onMarkdownChange: (markdown: string) => void
  languageLabel: string
  language: Language
  glossary: AdminBlogGlossaryEntry[]
  required?: boolean
  documentTitle?: string
}

export type MarkdownEditState = {
  value: string
  start: number
  end: number
}

export type MarkdownEdit = MarkdownEditState

export type GlossaryReferenceMatch = {
  start: number
  end: number
  label: string
  key: string
}

export type GlossaryMention = {
  key: string
  term: string
  text: string
  start: number
  end: number
}

export type GlossarySuggestion = {
  entry: AdminBlogGlossaryEntry
  exact: boolean
}
