import type { ReactNode } from "react"
import type { PropsWithClassName } from "../../../utils/types"

export type SegmentedControlOption<Value extends string> = {
  value: Value
  label: ReactNode
}

export type SegmentedControlProps<Value extends string> = PropsWithClassName<{
  ariaLabel: string
  optionClassName?: string
  options: readonly SegmentedControlOption<Value>[]
  value: Value | null
  onChange: (value: Value | null) => void
}>
