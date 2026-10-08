import type { ReactNode } from "react"
import type { Language } from "@/constants/intl"
import type { AdminBlogGlossaryEntry } from "@/services/blog"

export type MarkdownEditorProps = {
  markdown: string
  onMarkdownChange: (markdown: string) => void
  /** Header title. Without it the header only carries the edit/preview switch. */
  title?: string
  /** Helper line under the title. */
  description?: string
  /** Form field name of the textarea. Leave it out when nested in another form's fields. */
  name?: string
  placeholder?: string
  required?: boolean
  /** @default 50000 */
  maxLength?: number
  /** Ids of the toolbar actions to show, see MARKDOWN_TOOLBAR_GROUPS. Defaults to all of them. */
  toolbarActions?: string[]
  /** Glossary references panel. Shown only when a glossary is given. */
  glossary?: AdminBlogGlossaryEntry[]
  language?: Language
  /** Heading that is dropped from the preview because the page already renders it. */
  documentTitle?: string
  /** Edit/preview switch. @default true */
  preview?: boolean
  /** Replaces the post renderer of the preview. */
  renderPreview?: (markdown: string) => ReactNode
  /** Tailwind min-height of the textarea and of the preview. @default "min-h-[32rem]" */
  minHeightClassName?: string
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
