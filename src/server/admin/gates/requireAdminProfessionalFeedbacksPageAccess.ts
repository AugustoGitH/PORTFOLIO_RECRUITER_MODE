import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"

export const requireAdminProfessionalFeedbacksPageAccess = () => (
  requireAdminPermission("feedback.read")
)
