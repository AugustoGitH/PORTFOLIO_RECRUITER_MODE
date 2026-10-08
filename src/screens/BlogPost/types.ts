import type { Language } from "@/constants/intl"
import type { GlossaryDictionary } from "@/components/blog/MarkdownContent"

export type BlogPostHeading = {
  id: string
  label: string
  level: 2 | 3
}

export type BlogPostTranslation = {
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
  category: string
  minutes: number
}

export type BlogPostRecommendation = {
  slug: string
  title: string
  subtitle?: string
  category: string
  minutes: number
  cover?: BlogPostCover
  translations: Partial<Record<Language, Omit<BlogPostTranslation, "excerpt">>> & {
    ptbr: Omit<BlogPostTranslation, "excerpt">
  }
}

export type BlogPostCover = {
  url: string
  width: number
  height: number
}

export type BlogPost = {
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
  cover?: BlogPostCover
  translations: Partial<Record<Language, BlogPostTranslation>> & {
    ptbr: BlogPostTranslation
  }
}

export type BlogPostPageProps = {
  hasAdminSession: boolean
  post: BlogPost
  headings: Partial<Record<Language, BlogPostHeading[]>> & {
    ptbr: BlogPostHeading[]
  }
  glossary: Partial<Record<Language, GlossaryDictionary>> & {
    ptbr: GlossaryDictionary
  }
  recommendations: BlogPostRecommendation[]
}
