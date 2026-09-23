export type BlogListingPost = {
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

export type BlogLandingProps = {
  posts: BlogListingPost[]
}
