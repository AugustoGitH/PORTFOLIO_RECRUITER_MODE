import type { PortfolioAudience } from "@/providers/recruiterMode"
import type { Metrics } from "@/services/metric/useMetricsQuery"
import type {
  PublicRecommendation,
  RecommendationRole,
  RecommendationSeniority,
} from "@backend/developer-recommendations"
import type { PublicFeedback } from "@backend/feedback"

export type SearchParams = {
  audience?: string
  roles?: string
  seniority?: string
}

export type HomePageProps = {
  searchParams: Promise<SearchParams>
}

export type PageContext = {
  audience?: PortfolioAudience
  roles: RecommendationRole[]
  seniority?: RecommendationSeniority
  visitorId: string
}

export type InitialPageData = {
  metrics: Metrics
  feedbacks: PublicFeedback[]
  recommendations: PublicRecommendation[]
}
