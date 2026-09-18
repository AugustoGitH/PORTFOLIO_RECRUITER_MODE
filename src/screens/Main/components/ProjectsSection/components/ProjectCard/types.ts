import type { Project } from "../../../../../../constants/profile"
import type { PropsWithClassName, PropsWithStyle } from "../../../../../../utils/types"

export type ProjectCardProps = PropsWithClassName<PropsWithStyle<{
  project: Project
  featured?: boolean
}>>
