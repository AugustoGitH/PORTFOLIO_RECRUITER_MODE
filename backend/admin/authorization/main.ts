import "server-only"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { adminAuthService } from "@backend/admin/services"
import { adminCookieName, decryptAdminSession } from "@backend/admin/session"
import type { AdminPermission } from "./permissions"

export const getVerifiedAdminSession = async () => {
  const claims = await decryptAdminSession((await cookies()).get(adminCookieName)?.value)
  return claims ? adminAuthService.verify(claims) : null
}

export const requireAdminPermission = async (permission: AdminPermission) => {
  const session = await getVerifiedAdminSession()
  if (!session || !adminAuthService.hasPermission(session, permission)) notFound()
  return session
}
