import type { PropsWithChildren } from "react"
import type { PropsWithClassName } from "../../../utils/types"

export type ChipTone = "accent" | "neutral"

export type ChipSize = "sm" | "md"

export type ChipProps = PropsWithClassName<PropsWithChildren<{
  tone?: ChipTone
  size?: ChipSize
}>>
