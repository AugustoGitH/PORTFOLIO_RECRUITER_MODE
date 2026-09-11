import type { TagEntry } from "../Tag/types"
import type { PropsWithClassName } from "../../../utils/types"

export type OverflowTagsProps = PropsWithClassName<{
  tags: readonly TagEntry[]
  maxVisible?: number
  popoverName: string
}>
