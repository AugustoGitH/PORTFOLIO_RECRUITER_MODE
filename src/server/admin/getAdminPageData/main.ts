import "server-only"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { feedbackService } from "@backend/feedback"
import { portfolioFeedbackService } from "@backend/portfolio-feedbacks"
import type {
  AdminPageAccess,
  AdminLoginPageData,
  AdminDashboardPageData,
  AdminPortfolioFeedbacksPageData,
  AdminProfessionalFeedbacksPageData,
} from "./types"

export const getAdminDashboardPageData = (
  access: AdminPageAccess,
): AdminDashboardPageData => ({
  canManageLoginAttempts: access.permissions.includes("admin.login-attempts.manage"),
  canManagePublicRateLimits: access.permissions.includes("rate-limits.manage"),
})

export const getAdminLoginPageData = async (): Promise<AdminLoginPageData> => ({
  hasAdminSession: Boolean(await getVerifiedAdminSession()),
})

export const getAdminPortfolioFeedbacksPageData = async (
  cursor?: string,
  access?: AdminPageAccess,
): Promise<AdminPortfolioFeedbacksPageData> => {
  const page = await portfolioFeedbackService.list(cursor)

  return {
    feedbacks: page.items.map((feedback) => ({
      id: String(feedback._id),
      message: feedback.message,
      visitorId: feedback.visitorId,
      submittedAt: feedback.submittedAt.toISOString(),
      publicationConsent: feedback.publicationConsent ?? false,
      status: feedback.status ?? "pending",
      category: feedback.category ?? "general",
    })),
    nextCursor: page.nextCursor,
    canModerate: access?.permissions.includes("feedback.moderate") ?? false,
  }
}

export const getAdminProfessionalFeedbacksPageData = async (
  access: AdminPageAccess,
): Promise<AdminProfessionalFeedbacksPageData> => {
  const feedbacks = await feedbackService.listAllForModeration()

  return {
    canModerate: access.permissions.includes("feedback.moderate"),
    initialFeedbacks: await Promise.all(feedbacks.map(async (feedback) => ({
      id: String(feedback._id),
      message: feedback.message,
      linkedinUrl: feedback.linkedinUrl,
      submittedAt: feedback.submittedAt.toISOString(),
      status: feedback.status,
      editorial: feedback.editorial && {
        displayName: feedback.editorial.displayName,
        role: feedback.editorial.role,
        company: feedback.editorial.company,
        publicMessage: feedback.editorial.publicMessage,
      },
      avatarUrl: await feedbackService.getAvatarUrl(feedback.editorial?.profileImageId),
      companyImageUrl: await feedbackService.getAvatarUrl(feedback.editorial?.companyImageId),
    }))),
  }
}
