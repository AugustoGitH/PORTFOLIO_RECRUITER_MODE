import "server-only"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { blogService } from "@backend/blog"
import { estimateReadingMinutes } from "@/utils/date"
import type { BlogPageData } from "./types"

export const getBlogPageData = async (): Promise<BlogPageData> => {
  const [posts, categories, adminSession] = await Promise.all([
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
    getVerifiedAdminSession(),
  ])

  const categoryNames = new Map(
    categories.map((category) => [String(category._id), category.name]),
  )

  return {
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle,
      category: categoryNames.get(post.categoryId) ?? null,
      minutes: estimateReadingMinutes(post.markdown),
      cover: post.cover,
    })),
    hasAdminSession: Boolean(adminSession),
  }
}
