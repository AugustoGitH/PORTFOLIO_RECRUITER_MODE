import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"
import type { MarkdownEdit } from "../../types"

export type GlossaryAssistantProps = {
  markdown: string
  selection: { start: number; end: number }
  language: Language
  glossary: AdminBlogGlossaryEntry[]
  onApply: (edit: MarkdownEdit) => void
  onSelectRange: (start: number, end: number) => void
}
