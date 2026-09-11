import "server-only"
import * as argon2 from "argon2"
import { randomUUID } from "crypto"
import { adminRepository } from "@backend/admin/repositories"
import { encryptAdminSession, type AdminClaims } from "@backend/admin/session"

export const adminAuthService = {
  async login(emailInput: string, password: string) {
    const email = emailInput.trim().toLowerCase()
    const user = await adminRepository.findUserByEmail(email)
    if (!user || user.status !== "active" || !(await argon2.verify(user.passwordHash, password))) return null
    const roles = await adminRepository.findRoles(user.roleIds)
    const permissions = [...new Set([...roles.flatMap(role => role.permissions), ...(user.directPermissions ?? [])])]
    const sid = randomUUID()
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
    await adminRepository.createSession({ sessionId: sid, userId: user._id, authorizationVersion: user.authorizationVersion, passwordVersion: user.passwordVersion, createdAt: new Date(), updatedAt: new Date(), expiresAt })
    await adminRepository.recordLogin(user._id)
    const claims: AdminClaims = { sub: user._id.toHexString(), sid, roles: user.roleIds, permissions, av: user.authorizationVersion, pv: user.passwordVersion }
    return { token: await encryptAdminSession(claims), permissions }
  },
}
