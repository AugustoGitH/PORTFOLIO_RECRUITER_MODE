import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"

export type GlossaryTermFormProps = {
  initialTerm: string
  language: Language
  glossary: AdminBlogGlossaryEntry[]
  onCreated: (key: string, term: string) => void
  onCancel: () => void
}
