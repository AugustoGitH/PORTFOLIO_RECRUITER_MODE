import type { Link, PropsWithClassName, PropsWithStyle } from "../../../utils/types"
import type { TagProps } from "../../action/Tag"

export type CardProps = PropsWithClassName<PropsWithStyle<{
  icon?: React.ReactNode
  title: string
  description?: string
  tags?: TagProps[]
  links?: Link[]
}>>
