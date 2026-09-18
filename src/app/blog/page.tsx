import { blogService } from "@backend/blog"
import { BlogChrome } from "@/components/blog/BlogChrome"
import { BlogLanding } from "@/components/blog/BlogLanding"

export const dynamic = "force-dynamic"

const estimateReadingMinutes = (markdown: string) => {
  const words = markdown.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
  ])

  const categoryNames = new Map(categories.map((category) => [String(category._id), category.name]))
  const listing = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: categoryNames.get(post.categoryId) ?? null,
    minutes: estimateReadingMinutes(post.markdown),
  }))

  return (
    <BlogChrome>
      <BlogLanding posts={listing} />
    </BlogChrome>
  )
}
