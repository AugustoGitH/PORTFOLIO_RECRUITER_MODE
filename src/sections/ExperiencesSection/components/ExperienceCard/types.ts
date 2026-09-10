import type { Experience } from "../../../../constants/profile"
import type { PropsWithClassName, PropsWithStyle } from "../../../../utils/types"

export type ExperienceCardProps = PropsWithClassName<PropsWithStyle<{
  experience: Experience
}>>
