import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"

export const requireAdminRecommendationsPageAccess = () => (
  requireAdminPermission("recommendation.read")
)
