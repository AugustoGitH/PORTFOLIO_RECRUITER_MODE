export type BlogPostMetadataData = {
  slug: string
  title: string
  excerpt: string
  category: string
  locale: "pt_BR" | "en_US"
  publishedAt?: string
  cover?: {
    url: string
    width: number
    height: number
  }
}
