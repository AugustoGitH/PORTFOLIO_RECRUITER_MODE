import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"


export const requireAdminRecommendationsPageAccess = async (): Promise<void> => {
  await requireAdminPermission("recommendation.read")
}
