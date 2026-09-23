import { blogService } from "@backend/blog"
import { BlogChrome } from "@/components/blog/BlogChrome"
import { BlogLanding } from "@/components/blog/BlogLanding"
import { getVerifiedAdminSession } from "@backend/admin/authorization"

export const dynamic = "force-dynamic"

const estimateReadingMinutes = (markdown: string) => {
  const words = markdown.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export default async function BlogPage() {
  const [posts, categories, adminSession] = await Promise.all([
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
    getVerifiedAdminSession(),
  ])

  const categoryNames = new Map(categories.map((category) => [String(category._id), category.name]))
  const listing = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    category: categoryNames.get(post.categoryId) ?? null,
    minutes: estimateReadingMinutes(post.markdown),
    cover: post.cover,
  }))

  return (
    <BlogChrome hasAdminSession={Boolean(adminSession)}>
      <BlogLanding posts={listing} />
    </BlogChrome>
  )
}
