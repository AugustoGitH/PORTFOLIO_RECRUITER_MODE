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
}

export type BlogPageProps = {
  posts: BlogPagePost[]
  hasAdminSession: boolean
}
