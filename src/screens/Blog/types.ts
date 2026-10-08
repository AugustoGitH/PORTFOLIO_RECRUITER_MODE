import type { Language } from "@/constants/intl"

export type BlogPagePostTranslation = {
  slug: string
  title: string
  subtitle?: string
  markdown: string
  category: string | null
}

export type BlogPagePost = {
  slug: string
  title: string
  subtitle?: string
  category: string | null
  minutes: number
  cover?: {
    url: string
    width: number
    height: number
  }
  translations: Partial<Record<Language, BlogPagePostTranslation>> & {
    ptbr: BlogPagePostTranslation
  }
}

export type BlogPageProps = {
  posts: BlogPagePost[]
  hasAdminSession: boolean
}
