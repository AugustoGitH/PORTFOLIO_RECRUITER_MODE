import type { ChangeEventHandler } from "react"

export type MarkdownEditorProps = {
  markdown: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}
