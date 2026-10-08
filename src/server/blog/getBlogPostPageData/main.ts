import "server-only"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { blogService } from "@backend/blog"
import { estimateReadingMinutes } from "@/utils/date"
import { extractGlossaryKeys } from "@/utils/blog"
import { getPublishedBlogPost } from "../data"
import type { BlogPostPageData } from "./types"
import { getBlogPostHeadings } from "./utils"

export const getBlogPostPageData = async (
  slug: string,
): Promise<BlogPostPageData | null> => {
  const [post, posts, categories, adminSession] = await Promise.all([
    getPublishedBlogPost(slug),
    blogService.publishedPosts(),
    blogService.categories().catch(() => []),
    getVerifiedAdminSession(),
  ])
  if (!post) return null

  const glossaryKeys = [
    ...new Set(Object.values(post.translations).flatMap((translation) =>
      translation ? extractGlossaryKeys(translation.markdown) : [],
    )),
  ]
  const glossaryEntries = await blogService.glossaryEntries(glossaryKeys).catch(() => [])
  const glossary = Object.fromEntries(
    (["ptbr", "en"] as const).map((language) => [
      language,
      Object.fromEntries(glossaryEntries.map((entry) => {
        const translation = entry.translations[language] ?? entry.translations.ptbr
        return [entry.key, {
          key: entry.key,
          term: translation.term,
          definition: translation.definition,
        }]
      })),
    ]),
  ) as BlogPostPageData["glossary"]

  const categoryNames = new Map(
    categories.map((category) => [String(category._id), category.translations]),
  )
  const fallbackCategory = "Artigo"
  const recommendations = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((first, second) =>
      Number(second.categoryId === post.categoryId)
      - Number(first.categoryId === post.categoryId),
    )
    .slice(0, 2)
    .map((candidate) => {
      const localizedCategories = categoryNames.get(candidate.categoryId)

      return {
        slug: candidate.slug,
        title: candidate.title,
        subtitle: candidate.subtitle,
        category: localizedCategories?.ptbr.name ?? fallbackCategory,
        minutes: estimateReadingMinutes(candidate.markdown),
        cover: candidate.cover,
        translations: Object.fromEntries(
          Object.entries(candidate.translations).map(([language, translation]) => [
            language,
            translation && {
              ...translation,
              category: localizedCategories?.[language as keyof typeof localizedCategories]?.name
                ?? localizedCategories?.ptbr.name
                ?? fallbackCategory,
              minutes: estimateReadingMinutes(translation.markdown),
            },
          ]),
        ) as unknown as BlogPostPageData["recommendations"][number]["translations"],
      }
    })

  const localizedCategories = categoryNames.get(post.categoryId)
  const translations = Object.fromEntries(
    Object.entries(post.translations).map(([language, translation]) => [
      language,
      translation && {
        ...translation,
        category: localizedCategories?.[language as keyof typeof localizedCategories]?.name
          ?? localizedCategories?.ptbr.name
          ?? fallbackCategory,
        minutes: estimateReadingMinutes(translation.markdown),
      },
    ]),
  ) as unknown as BlogPostPageData["post"]["translations"]

  return {
    hasAdminSession: Boolean(adminSession),
    post: {
      ...post,
      category: localizedCategories?.ptbr.name ?? fallbackCategory,
      minutes: estimateReadingMinutes(post.markdown),
      translations,
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
    },
    headings: Object.fromEntries(
      Object.entries(post.translations).map(([language, translation]) => [
        language,
        translation ? getBlogPostHeadings(translation.markdown, translation.title) : [],
      ]),
    ) as unknown as BlogPostPageData["headings"],
    glossary,
    recommendations,
  }
}
