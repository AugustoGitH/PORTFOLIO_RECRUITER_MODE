import { describe, expect, it } from "vitest"
import {
  blogImagePurposeSchema,
  blogPostSchema,
} from "./schemas"

const validPost = {
  status: "draft",
  translations: {
    ptbr: {
      slug: "um-post",
      title: "Um post",
      subtitle: "Uma explicação complementar para o título.",
      excerpt: "Resumo usado na listagem pública.",
      markdown: "# Conteúdo",
    },
  },
  categoryId: "507f1f77bcf86cd799439011",
}

describe("blog controller schemas", () => {
  it("accepts a post with an optional subtitle", () => {
    expect(blogPostSchema.safeParse(validPost).success).toBe(true)
    expect(blogPostSchema.safeParse({
      ...validPost,
      translations: {
        ptbr: { ...validPost.translations.ptbr, subtitle: undefined },
      },
    }).success).toBe(true)
  })

  it("rejects empty and oversized subtitles", () => {
    expect(blogPostSchema.safeParse({
      ...validPost,
      translations: { ptbr: { ...validPost.translations.ptbr, subtitle: " " } },
    }).success).toBe(false)
    expect(blogPostSchema.safeParse({
      ...validPost,
      translations: { ptbr: { ...validPost.translations.ptbr, subtitle: "a".repeat(221) } },
    }).success).toBe(false)
  })

  it("rejects malformed category ids", () => {
    expect(blogPostSchema.safeParse({ ...validPost, categoryId: "not-an-object-id-value" }).success).toBe(false)
  })

  it("allows an incomplete English draft but requires complete published translations", () => {
    const englishDraft = {
      slug: "",
      title: "English title",
      excerpt: "",
      markdown: "",
    }
    const translations = { ...validPost.translations, en: englishDraft }

    expect(blogPostSchema.safeParse({ ...validPost, translations }).success).toBe(true)
    expect(blogPostSchema.safeParse({ ...validPost, status: "published", translations }).success).toBe(false)
  })

  it("accepts only content and cover image purposes", () => {
    expect(blogImagePurposeSchema.safeParse("content").success).toBe(true)
    expect(blogImagePurposeSchema.safeParse("cover").success).toBe(true)
    expect(blogImagePurposeSchema.safeParse("avatar").success).toBe(false)
  })
})
