import { z } from "zod"

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)
const glossaryKeySchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80)

const blogGlossaryTranslationSchema = z.object({
  term: z.string().trim().min(1).max(120),
  definition: z.string().trim().min(1).max(600),
  aliases: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
}).strict()

const draftBlogGlossaryTranslationSchema = z.object({
  term: z.string().trim().max(120),
  definition: z.string().trim().max(600),
  aliases: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
}).strict()

export const blogGlossaryEntrySchema = z.object({
  key: glossaryKeySchema,
  status: z.enum(["active", "archived"]),
  translations: z.object({
    ptbr: blogGlossaryTranslationSchema,
    en: draftBlogGlossaryTranslationSchema.optional(),
  }).strict(),
}).strict()

const blogPostTranslationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().min(1).max(220).optional(),
  excerpt: z.string().trim().min(1).max(320),
  markdown: z.string().min(1).max(50_000),
}).strict()

const draftBlogPostTranslationSchema = z.object({
  slug: z.union([z.literal(""), z.string().regex(/^[a-z0-9-]+$/)]),
  title: z.string().trim().max(160),
  subtitle: z.string().trim().max(220).optional(),
  excerpt: z.string().trim().max(320),
  markdown: z.string().max(50_000),
}).strict()

export const blogPostSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
  translations: z.object({
    ptbr: blogPostTranslationSchema,
    en: draftBlogPostTranslationSchema.optional(),
  }).strict(),
  categoryId: objectIdSchema,
}).strict().superRefine((post, context) => {
  if (post.status !== "published" || !post.translations.en) return
  if (blogPostTranslationSchema.safeParse(post.translations.en).success) return

  context.addIssue({
    code: "custom",
    path: ["translations", "en"],
    message: "Published translations must be complete",
  })
})

const blogCategoryTranslationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional(),
}).strict()

export const blogCategorySchema = z.object({
  translations: z.object({
    ptbr: blogCategoryTranslationSchema,
    en: blogCategoryTranslationSchema.optional(),
  }).strict(),
}).strict()

export const blogImagePurposeSchema = z.enum(["content", "cover"])
