import "server-only"
import { headers } from "next/headers"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { TESTIMONIALS } from "@/constants/profile"
import type { Metrics } from "@/services/metric/useMetricsQuery"
import { feedbackService } from "@backend/feedback"
import { portfolioFeedbackService } from "@backend/portfolio-feedbacks"
import { metricsService } from "@backend/metrics"
import { recommendationService } from "@backend/developer-recommendations"
import { blogService } from "@backend/blog"
import { estimateReadingMinutes } from "@/utils/date"
import { DEFAULT_METRICS } from "./constants"
import type { InitialPageData, PageContext } from "./types"
import { getPageContext } from "./utils"

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

const getFeaturedBlogPost = async () => {
  const [posts, categories] = await Promise.all([
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
  ])
  const post = posts[0]
  if (!post) return null

  const categoryNames = new Map(
    categories.map((category) => [String(category._id), category.translations]),
  )
  const localizedCategories = categoryNames.get(post.categoryId)

  return {
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    category: localizedCategories?.ptbr.name ?? null,
    minutes: estimateReadingMinutes(post.markdown),
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    views: post.views,
    likes: post.likes,
    cover: post.cover,
    translations: Object.fromEntries(
      Object.entries(post.translations).map(([language, translation]) => [
        language,
        translation && {
          ...translation,
          category: localizedCategories?.[language as keyof typeof localizedCategories]?.name
            ?? localizedCategories?.ptbr.name
            ?? null,
        },
      ]),
    ) as unknown as NonNullable<InitialPageData["featuredBlogPost"]>["translations"],
  }
}

export const getInitialPortfolioData = async (context: PageContext): Promise<InitialPageData> => {
  const [metrics, feedbacks, portfolioFeedbacks, recommendations, featuredBlogPost] = await Promise.all([
    getInitialMetrics(context.visitorId),
    feedbackService.getPublished(),
    portfolioFeedbackService.getPublished(),
    context.audience === "recruiter"
      ? recommendationService.select({ roles: context.roles, seniority: context.seniority })
      : Promise.resolve([]),
    getFeaturedBlogPost(),
  ])

  return {
    metrics: {
      ...metrics,
      professionalFeedbacks: feedbacks.length || TESTIMONIALS.length,
    },
    feedbacks,
    portfolioFeedbacks,
    recommendations,
    featuredBlogPost,
  }
}

export const getPortfolioPageData = async (
  searchParams: Promise<import("./types").SearchParams>,
) => {
  const [params, requestHeaders] = await Promise.all([searchParams, headers()])
  const context = getPageContext(params, requestHeaders.get("x-visitor-id") ?? "anonymous")
  const [initialData, adminSession] = await Promise.all([
    getInitialPortfolioData(context),
    getVerifiedAdminSession(),
  ])

  return {
    ...initialData,
    hasAdminSession: Boolean(adminSession),
  }
}
