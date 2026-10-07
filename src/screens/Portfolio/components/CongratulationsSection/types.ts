import { PropsWithClassName } from "@/utils/types"
import type { PublicPortfolioFeedback } from "@/types/service/portfolio-feedback"

export type CongratulationsSectionProps = PropsWithClassName<{
  initialLiked: boolean
  feedbacks: PublicPortfolioFeedback[]
}>
