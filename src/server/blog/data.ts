import "server-only"
import { cache } from "react"
import { blogService } from "@backend/blog"

export const getPublishedBlogPost = cache((slug: string) =>
  blogService.publishedPost(slug),
)
