import type { MarkdownEdit, MarkdownEditState } from "../../types"

export type MarkdownToolbarProps = {
  getState: () => MarkdownEditState
  onApply: (edit: MarkdownEdit) => void
}
