export type BlogPostHeading = {
  id: string
  label: string
  level: 2 | 3
}

export type BlogPostRecommendation = {
  slug: string
  title: string
  subtitle?: string
  category: string
  minutes: number
  cover?: {
    url: string
    width: number
    height: number
  }
}

export type BlogPostDetailProps = {
  post: {
    slug: string
    title: string
    subtitle?: string
    excerpt: string
    markdown: string
    category: string
    minutes: number
    publishedAt?: string
    likes: number
    views: number
    cover?: {
      url: string
      width: number
      height: number
    }
  }
  headings: BlogPostHeading[]
  recommendations: BlogPostRecommendation[]
}
