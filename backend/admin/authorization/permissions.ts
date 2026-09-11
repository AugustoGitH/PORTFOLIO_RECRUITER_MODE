import "server-only"

export const ADMIN_PERMISSIONS = [
  "admin.access", "admin.dashboard.read", "metrics.read", "feedback.read", "feedback.moderate",
  "resume.catalog.read", "resume.catalog.manage", "admin.users.read", "admin.users.manage", "audit.read",
] as const

export type AdminPermission = typeof ADMIN_PERMISSIONS[number]
export const SUPERADMIN_ROLE_ID = "superadmin"
