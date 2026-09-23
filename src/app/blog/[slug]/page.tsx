import { notFound } from "next/navigation"
import { blogService } from "@backend/blog"
import { BlogChrome } from "@/components/blog/BlogChrome"
import { BlogPostDetail, type BlogPostHeading } from "@/components/blog/BlogPostDetail"
import { toSlug } from "@/utils/string"
import { getVerifiedAdminSession } from "@backend/admin/authorization"

export const dynamic = "force-dynamic"

const estimateReadingMinutes = (markdown: string) => {
  const words = markdown.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

const getHeadings = (markdown: string): BlogPostHeading[] => {
  const occurrences = new Map<string, number>()

  return markdown
    .split("\n")
    .flatMap((line) => {
      const match = /^(##|###)\s+(.+?)\s*#*$/.exec(line.trim())
      if (!match) return []

      const label = match[2]
        .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
        .replace(/[*_`~]/g, "")
        .trim()
      const baseId = toSlug(label) || "secao"
      const occurrence = (occurrences.get(baseId) ?? 0) + 1
      occurrences.set(baseId, occurrence)

      return [{
        id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
        label,
        level: match[1].length as 2 | 3,
      }]
    })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, posts, categories, adminSession] = await Promise.all([
    blogService.publishedPost(slug),
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
    getVerifiedAdminSession(),
  ])
  if (!post) notFound()

  const categoryNames = new Map(categories.map((category) => [String(category._id), category.name]))
  const category = categoryNames.get(post.categoryId) ?? "Artigo"
  const recommendations = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((first, second) => {
      const firstMatchesCategory = first.categoryId === post.categoryId ? 1 : 0
      const secondMatchesCategory = second.categoryId === post.categoryId ? 1 : 0
      return secondMatchesCategory - firstMatchesCategory
    })
    .slice(0, 2)
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
      subtitle: candidate.subtitle,
      category: categoryNames.get(candidate.categoryId) ?? "Artigo",
      minutes: estimateReadingMinutes(candidate.markdown),
      cover: candidate.cover,
    }))

  return (
    <BlogChrome hasAdminSession={Boolean(adminSession)}>
      <BlogPostDetail
        post={{
          ...post,
          category,
          minutes: estimateReadingMinutes(post.markdown),
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString()
            : undefined,
        }}
        headings={getHeadings(post.markdown)}
        recommendations={recommendations}
      />
    </BlogChrome>
  )
}
