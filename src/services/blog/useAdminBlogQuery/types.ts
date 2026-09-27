export type AdminBlogCategory = {
  _id: string
  slug: string
  name: string
  description?: string
}

export type AdminBlogMedia = {
  id: string
  publicUrl: string
  width?: number
  height?: number
}

export type AdminBlogPost = {
  _id: string
  slug: string
  status: "draft" | "published" | "archived"
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
  categoryId: string
  cover?: AdminBlogMedia
  media?: AdminBlogMedia[]
}

export type AdminBlogData = {
  posts: AdminBlogPost[]
  categories: AdminBlogCategory[]
}
