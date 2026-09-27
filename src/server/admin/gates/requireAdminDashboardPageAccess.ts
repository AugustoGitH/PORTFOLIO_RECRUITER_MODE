import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"

export const requireAdminDashboardPageAccess = () => (
  requireAdminPermission("admin.dashboard.read")
)
