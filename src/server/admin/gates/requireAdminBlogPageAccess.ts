import "server-only"

import { requireAdminPermission } from "@backend/admin/authorization"

export const requireAdminBlogPageAccess = () => (
  requireAdminPermission("blog.read")
)
