import type { PropsWithClassName } from "@/utils/types"
import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"

export type GlossaryTermFormProps = PropsWithClassName<{
  /** Term being edited. Without it the form creates a new term. */
  entry?: AdminBlogGlossaryEntry
  /** Term prefilled when creating, e.g. the text selected in the editor. */
  initialTerm?: string
  /** Language the form opens in, and the one `initialTerm` belongs to. */
  language: Language
  /** Existing terms, used to reject a key that is already taken. */
  glossary: AdminBlogGlossaryEntry[]
  description?: string
  submitLabel: string
  onSaved: (key: string, term: string) => void
  onCancel?: () => void
}>
