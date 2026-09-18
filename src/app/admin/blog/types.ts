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
  excerpt: string
  markdown: string
  categoryId: string
  media?: Array<{
    id: string
    publicUrl: string
  }>
}

export type BlogAdminData = {
  posts: BlogPost[]
  categories: BlogCategory[]
}

export type BlogEditorMode = "edit" | "preview"
