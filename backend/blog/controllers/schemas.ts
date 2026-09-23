import { z } from "zod"

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)

export const blogPostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published", "archived"]),
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().min(1).max(220).optional(),
  excerpt: z.string().trim().min(1).max(320),
  markdown: z.string().min(1).max(50_000),
  categoryId: objectIdSchema,
}).strict()

export const blogCategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional(),
}).strict()

export const blogImagePurposeSchema = z.enum(["content", "cover"])
