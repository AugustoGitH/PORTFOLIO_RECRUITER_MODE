import "server-only"
import { EncryptJWT, jwtDecrypt } from "jose"
import type { AdminPermission } from "@backend/admin/authorization/permissions"

const issuer = "portfolio-v100"
const audience = "portfolio-v100-admin"
const getKey = () => {
  const value = process.env.ADMIN_JWT_ENCRYPTION_KEY
  if (!value) throw new Error("ADMIN_JWT_ENCRYPTION_KEY is required")
  const key = Buffer.from(value, "base64url")
  if (key.length !== 32) throw new Error("ADMIN_JWT_ENCRYPTION_KEY must decode to 32 bytes")
  return key
}
export type AdminClaims = { sub: string; sid: string; roles: string[]; permissions: AdminPermission[]; av: number; pv: number }
export const encryptAdminSession = (claims: AdminClaims) => new EncryptJWT(claims).setProtectedHeader({ alg: "dir", enc: "A256GCM", kid: process.env.ADMIN_JWT_KEY_ID ?? "active" }).setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime("8h").setJti(claims.sid).encrypt(getKey())
export const decryptAdminSession = async (token?: string) => {
  if (!token) return null
  try {
    const { payload, protectedHeader } = await jwtDecrypt(token, getKey(), { issuer, audience, keyManagementAlgorithms: ["dir"], contentEncryptionAlgorithms: ["A256GCM"] })
    if (protectedHeader.kid !== (process.env.ADMIN_JWT_KEY_ID ?? "active") || !payload.sub || typeof payload.sid !== "string" || !Array.isArray(payload.permissions) || typeof payload.av !== "number" || typeof payload.pv !== "number") return null
    return payload as unknown as AdminClaims
  } catch { return null }
}
export const adminCookieName = process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session"
export const adminCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: 60 * 60 * 8, priority: "high" as const }
