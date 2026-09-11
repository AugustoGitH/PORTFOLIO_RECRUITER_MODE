import "server-only"
import type { Collection, Db, ObjectId } from "mongodb"
import type { MongoDocument } from "@backend/libs/db/mongo"
import type { AdminPermission } from "@backend/admin/authorization/permissions"

export type AdminUser = MongoDocument & { email: string; passwordHash: string; roleIds: string[]; directPermissions?: AdminPermission[]; status: "active" | "disabled"; authorizationVersion: number; passwordVersion: number; lastLoginAt?: Date }
export type AdminRole = MongoDocument & { roleId: string; name: string; permissions: AdminPermission[]; version: number }
export type AdminSession = MongoDocument & { sessionId: string; userId: ObjectId; authorizationVersion: number; passwordVersion: number; expiresAt: Date; revokedAt?: Date; lastSeenAt?: Date }
export const getAdminUsersCollection = (db: Db): Collection<AdminUser> => db.collection("admin_users")
export const getAdminRolesCollection = (db: Db): Collection<AdminRole> => db.collection("admin_roles")
export const getAdminSessionsCollection = (db: Db): Collection<AdminSession> => db.collection("admin_sessions")
