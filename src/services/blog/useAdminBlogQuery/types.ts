import type { Language } from "@/constants/intl"

export type AdminBlogCategoryTranslation = {
  slug: string
  name: string
  description?: string
}

export type AdminBlogPostTranslation = {
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
}

export type AdminBlogGlossaryTranslation = {
  term: string
  definition: string
  aliases?: string[]
}

export type AdminBlogGlossaryEntry = {
  _id: string
  key: string
  status: "active" | "archived"
  translations: Partial<Record<Language, AdminBlogGlossaryTranslation>> & {
    ptbr: AdminBlogGlossaryTranslation
  }
}

export type AdminBlogCategory = {
  _id: string
  translations: Partial<Record<Language, AdminBlogCategoryTranslation>> & {
    ptbr: AdminBlogCategoryTranslation
  }
}

export type AdminBlogMedia = {
  id: string
  publicUrl: string
  width?: number
  height?: number
}

export type AdminBlogPost = {
  _id: string
  status: "draft" | "published" | "archived"
  translations: Partial<Record<Language, AdminBlogPostTranslation>> & {
    ptbr: AdminBlogPostTranslation
  }
  categoryId: string
  cover?: AdminBlogMedia
  media?: AdminBlogMedia[]
}

export type AdminBlogData = {
  posts: AdminBlogPost[]
  categories: AdminBlogCategory[]
  glossary: AdminBlogGlossaryEntry[]
}
