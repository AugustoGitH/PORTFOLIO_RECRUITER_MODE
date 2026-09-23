import type { ReactNode } from "react"
import type { PropsWithClassName } from "../../../utils/types"

export type TitleSectionProps = PropsWithClassName<{
  subtitle: ReactNode
  tag?: ReactNode
  title: ReactNode
}>
