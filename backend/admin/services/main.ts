import "server-only"
import * as argon2 from "argon2"
import { randomUUID } from "crypto"
import { adminRepository } from "@backend/admin/repositories"
import { encryptAdminSession, type AdminClaims } from "@backend/admin/session"
import type { AdminPermission } from "@backend/admin/authorization/permissions"
import {
  consumeRateLimit,
  listRateLimitBuckets,
  resetRateLimit,
  type RateLimitResult,
} from "@backend/security/rate-limit"

export type AdminLoginRateLimitResult = RateLimitResult

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
  async verify(claims: AdminClaims) {
    const [session, user] = await Promise.all([adminRepository.findSession(claims.sid), adminRepository.findUserById(claims.sub)])
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !user || user.status !== "active") return null
    if (session.userId.toHexString() !== claims.sub || session.authorizationVersion !== claims.av || session.passwordVersion !== claims.pv || user.authorizationVersion !== claims.av || user.passwordVersion !== claims.pv) return null
    return { userId: claims.sub, permissions: claims.permissions }
  },
  async logout(sessionId: string) { await adminRepository.revokeSession(sessionId) },
  hasPermission(session: { permissions: AdminPermission[] }, permission: AdminPermission) { return session.permissions.includes(permission) },
  async consumeLoginAttempt(
    scope: "ip" | "email",
    identifier: string,
    limit: number,
    windowMs: number,
  ) {
    return consumeRateLimit({
      scope: "admin-login",
      dimension: scope,
      identifier,
      limit,
      windowMs,
    })
  },
  async listLoginIpRateLimits(limit: number) {
    const rateLimits = await listRateLimitBuckets("admin-login", "ip")

    return rateLimits.map((rateLimit) => ({
      ip: rateLimit.identifier,
      count: rateLimit.count,
      attemptsRemaining: Math.max(0, limit - rateLimit.count),
      isBlocked: rateLimit.count >= limit,
      windowStartedAt: rateLimit.windowStartedAt,
      lastAttemptAt: rateLimit.lastAttemptAt,
      expiresAt: rateLimit.expiresAt,
    }))
  },
  async resetLoginIpRateLimit(ip: string) {
    await resetRateLimit("admin-login", "ip", ip)
  },
  async resetSuccessfulLoginRateLimits(ip: string, email: string) {
    await Promise.all([
      resetRateLimit("admin-login", "ip", ip),
      resetRateLimit("admin-login", "email", email),
    ])
  },
}
