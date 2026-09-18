export type BlogListingPost = {
  slug: string
  title: string
  excerpt: string
  category: string | null
  minutes: number
}

export type BlogLandingProps = {
  posts: BlogListingPost[]
}
