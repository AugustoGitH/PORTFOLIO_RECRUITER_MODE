import "server-only"
import { z } from "zod"
import { FEEDBACK_STATUSES } from "@backend/feedback/models"

const linkedinUrl = z.string().url().max(2048).refine((value) => {
  const url = new URL(value)
  return url.protocol === "https:" && (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))
}, "LinkedIn URL must use HTTPS and linkedin.com")

export const feedbackSubmissionSchema = z.object({
  message: z.string().trim().min(20).max(1500),
  linkedinUrl: linkedinUrl.optional().or(z.literal("")),
  consent: z.literal(true),
  consentVersion: z.string().min(1).max(64).default("v1"),
}).strict()

export const feedbackStatusSchema = z.enum(FEEDBACK_STATUSES)
export const feedbackModerationSchema = z.object({
  status: feedbackStatusSchema.optional(),
  editorial: z.object({
    displayName: z.string().trim().min(1).max(160),
    role: z.string().trim().min(1).max(160).optional(),
    company: z.string().trim().min(1).max(160).optional(),
    publicMessage: z.string().trim().min(1).max(1500),
    linkedinUrl: linkedinUrl.optional(),
  }).strict().optional(),
}).refine((value) => value.status !== undefined || value.editorial !== undefined, "A status or editorial content is required")
