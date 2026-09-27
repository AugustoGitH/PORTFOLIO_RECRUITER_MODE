import "server-only"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { blogService } from "@backend/blog"
import { estimateReadingMinutes } from "@/utils/date"
import type { BlogPostPageData } from "./types"
import { getBlogPostHeadings } from "./utils"

export const getBlogPostPageData = async (
  slug: string,
): Promise<BlogPostPageData | null> => {
  const [post, posts, categories, adminSession] = await Promise.all([
    blogService.publishedPost(slug),
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
    getVerifiedAdminSession(),
  ])
  if (!post) return null

  const categoryNames = new Map(
    categories.map((category) => [String(category._id), category.name]),
  )
  const fallbackCategory = "Artigo"
  const recommendations = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((first, second) =>
      Number(second.categoryId === post.categoryId)
      - Number(first.categoryId === post.categoryId),
    )
    .slice(0, 2)
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
      subtitle: candidate.subtitle,
      category: categoryNames.get(candidate.categoryId) ?? fallbackCategory,
      minutes: estimateReadingMinutes(candidate.markdown),
      cover: candidate.cover,
    }))

  return {
    hasAdminSession: Boolean(adminSession),
    post: {
      ...post,
      category: categoryNames.get(post.categoryId) ?? fallbackCategory,
      minutes: estimateReadingMinutes(post.markdown),
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    },
    headings: getBlogPostHeadings(post.markdown),
    recommendations,
  }
}
