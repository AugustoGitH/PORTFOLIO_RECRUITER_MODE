import "server-only"
import { TESTIMONIALS } from "@/constants/profile"
import type { Metrics } from "@/services/metric/useMetricsQuery"
import { feedbackService } from "@backend/feedback"
import { metricsService } from "@backend/metrics"
import { recommendationService } from "@backend/developer-recommendations"
import { DEFAULT_METRICS } from "./constants"
import type { InitialPageData, PageContext } from "./types"

const getInitialMetrics = async (visitorId: string): Promise<Metrics> => {
  try {
    const views = await metricsService.registerPortfolioView(visitorId)
    const snapshot = await metricsService.getSnapshot(visitorId)

    return {
      ...snapshot,
      views,
      professionalFeedbacks: TESTIMONIALS.length,
    }
  } catch (error) {
    console.error("Unable to load portfolio metrics", error)
    return DEFAULT_METRICS
  }
}

export const getInitialPageData = async (context: PageContext): Promise<InitialPageData> => {
  const [metrics, feedbacks, recommendations] = await Promise.all([
    getInitialMetrics(context.visitorId),
    feedbackService.getPublished(),
    context.audience === "recruiter"
      ? recommendationService.select({ roles: context.roles, seniority: context.seniority })
      : Promise.resolve([]),
  ])

  return {
    metrics: {
      ...metrics,
      professionalFeedbacks: feedbacks.length || TESTIMONIALS.length,
    },
    feedbacks,
    recommendations,
  }
}
