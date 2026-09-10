export type TagEntry = {
  icon?: React.ReactNode
  label: string
  value: string
}

import type { PropsWithClassName, PropsWithStyle } from "../../../utils/types"

export type TagProps = PropsWithClassName<PropsWithStyle<{
  tag: TagEntry
}>>
