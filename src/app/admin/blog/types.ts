export type BlogCategory = {
  _id: string
  slug: string
  name: string
  description?: string
}

export type BlogPost = {
  _id: string
  slug: string
  status: "draft" | "published" | "archived"
  title: string
  subtitle?: string
  excerpt: string
  markdown: string
  categoryId: string
  cover?: BlogMedia
  media?: BlogMedia[]
}

export type BlogMedia = {
  id: string
  publicUrl: string
  width?: number
  height?: number
}

export type BlogImageUpload = {
  mediaId: string
  publicUrl: string
  width: number
  height: number
}

export type BlogAdminData = {
  posts: BlogPost[]
  categories: BlogCategory[]
}

export type BlogEditorMode = "edit" | "preview"
