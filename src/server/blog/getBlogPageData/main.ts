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
    categories.map((category) => [String(category._id), category.translations]),
  )

  return {
    posts: posts.map((post) => {
      const localizedCategories = categoryNames.get(post.categoryId)

      return {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        category: localizedCategories?.ptbr.name ?? null,
        minutes: estimateReadingMinutes(post.markdown),
        cover: post.cover,
        translations: Object.fromEntries(
          Object.entries(post.translations).map(([language, translation]) => [
            language,
            translation && {
              slug: translation.slug,
              title: translation.title,
              subtitle: translation.subtitle,
              markdown: translation.markdown,
              category: localizedCategories?.[language as keyof typeof localizedCategories]?.name
                ?? localizedCategories?.ptbr.name
                ?? null,
            },
          ]),
        ) as unknown as BlogPageData["posts"][number]["translations"],
      }
    }),
    hasAdminSession: Boolean(adminSession),
  }
}
