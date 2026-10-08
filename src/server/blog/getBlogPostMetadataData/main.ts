import "server-only"
import { cache } from "react"
import { blogService } from "@backend/blog"
import { getPublishedBlogPost } from "../data"
import type { BlogPostMetadataData } from "./types"

export const getBlogPostMetadataData = cache(async (
  slug: string,
): Promise<BlogPostMetadataData | null> => {
  const [post, categories] = await Promise.all([
    getPublishedBlogPost(slug),
    blogService.categories().catch(() => []),
  ])

  if (!post) return null

  const translationEntry = Object.entries(post.translations).find(
    ([, translation]) => translation?.slug === slug,
  )
  const language = translationEntry?.[0] === "en" ? "en" : "ptbr"
  const translation = translationEntry?.[1] ?? post.translations.ptbr
  const category = categories.find(
    (candidate) => String(candidate._id) === post.categoryId,
  )

  return {
    slug: translation.slug,
    title: translation.title,
    excerpt: translation.excerpt,
    category: category?.translations[language]?.name
      ?? category?.translations.ptbr.name
      ?? (language === "en" ? "Article" : "Artigo"),
    locale: language === "en" ? "en_US" : "pt_BR",
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    cover: post.cover,
  }
})
