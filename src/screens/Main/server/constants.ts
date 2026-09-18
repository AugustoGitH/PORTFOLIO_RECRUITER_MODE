import { TESTIMONIALS } from "@/constants/profile"
import type { PortfolioAudience } from "@/providers/recruiterMode"
import type { Metrics } from "@/services/metric/useMetricsQuery"
import type {
  RecommendationRole,
  RecommendationSeniority,
} from "@backend/developer-recommendations"

export const VALID_AUDIENCES: PortfolioAudience[] = ["default", "recruiter"]
export const VALID_ROLES: RecommendationRole[] = ["frontend", "backend", "database", "tests", "architecture", "tools"]
export const VALID_SENIORITIES: RecommendationSeniority[] = ["junior", "mid-level", "senior"]

export const DEFAULT_METRICS: Metrics = {
  likes: 0,
  liked: false,
  views: 0,
  resumeDownloads: 0,
  professionalFeedbacks: TESTIMONIALS.length,
}
