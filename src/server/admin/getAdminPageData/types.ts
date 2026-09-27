import type { AdminPermission } from "@backend/admin/authorization"
import type { AdminPageProps } from "@/screens/Admin"
import type { AdminPortfolioFeedbacksPageProps } from "@/screens/AdminPortfolioFeedbacks"
import type { AdminProfessionalFeedbacksPageProps } from "@/screens/AdminProfessionalFeedbacks"

export type AdminLoginPageData = {
  hasAdminSession: boolean
}

export type AdminPageAccess = {
  permissions: AdminPermission[]
}

export type AdminDashboardPageData = AdminPageProps
export type AdminPortfolioFeedbacksPageData = AdminPortfolioFeedbacksPageProps
export type AdminProfessionalFeedbacksPageData = AdminProfessionalFeedbacksPageProps
