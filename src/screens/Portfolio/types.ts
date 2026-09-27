import { Metrics } from "@/services/metric"
import { Feedback } from "@/types/service/feedback"
import { Recommendation } from "@/types/service/recommendation"

export type PortfolioProps = {
  metrics: Metrics
  recommendations: Recommendation[]
  feedbacks: Feedback[]
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
}
