import type { PortfolioAudience } from "@/providers/recruiterMode"
import type { Metrics } from "@/services/metric/useMetricsQuery"
import type {
  PublicRecommendation,
  RecommendationRole,
  RecommendationSeniority,
} from "@backend/developer-recommendations"
import type { PublicFeedback } from "@backend/feedback"
import type { PortfolioFeaturedBlogPost } from "@/screens/Portfolio"
import type { PublicPortfolioFeedback } from "@/types/service/portfolio-feedback"

export type SearchParams = {
  audience?: string
  roles?: string
  seniority?: string
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
  portfolioFeedbacks: PublicPortfolioFeedback[]
  recommendations: PublicRecommendation[]
  featuredBlogPost: PortfolioFeaturedBlogPost | null
}
