import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"

export const requireAdminPortfolioFeedbacksPageAccess = () => (
  requireAdminPermission("feedback.read")
)
