import type { MarkdownEdit, MarkdownEditState } from "../../types"

export type MarkdownToolbarProps = {
  /** Ids of the actions to show. Defaults to the full toolbar. */
  actions?: string[]
  getState: () => MarkdownEditState
  onApply: (edit: MarkdownEdit) => void
}
