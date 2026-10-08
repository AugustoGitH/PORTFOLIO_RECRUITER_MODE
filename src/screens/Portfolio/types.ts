import { Metrics } from "@/services/metric"
import { Feedback } from "@/types/service/feedback"
import { Recommendation } from "@/types/service/recommendation"
import type { PublicPortfolioFeedback } from "@/types/service/portfolio-feedback"

export type PortfolioProps = {
  metrics: Metrics
  recommendations: Recommendation[]
  feedbacks: Feedback[]
  portfolioFeedbacks: PublicPortfolioFeedback[]
  featuredBlogPost: PortfolioFeaturedBlogPost | null
  hasAdminSession: boolean
}

export type PortfolioFeaturedBlogPost = {
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  category: string | null
  minutes: number
  publishedAt?: string
  views: number
  likes: number
  cover?: {
    url: string
    width: number
    height: number
  }
  translations: Partial<Record<Language, {
    slug: string
    title: string
    subtitle?: string
    excerpt: string
    markdown: string
    category: string | null
  }>> & {
    ptbr: {
      slug: string
      title: string
      subtitle?: string
      excerpt: string
      markdown: string
      category: string | null
    }
  }
}
import type { Language } from "@/constants/intl"
