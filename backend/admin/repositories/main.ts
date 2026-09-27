import "server-only"
import { ObjectId } from "mongodb"
import { getMongoDb } from "@backend/libs/db/mongo"
import {
  getAdminRolesCollection,
  getAdminSessionsCollection,
  getAdminUsersCollection,
  type AdminSession,
} from "@backend/admin/models"

export const adminRepository = {
  async findUserByEmail(email: string) { return getAdminUsersCollection(await getMongoDb()).findOne({ email }) },
  async findUserById(id: string) { return ObjectId.isValid(id) ? getAdminUsersCollection(await getMongoDb()).findOne({ _id: new ObjectId(id) }) : null },
  async findRoles(ids: string[]) { return getAdminRolesCollection(await getMongoDb()).find({ roleId: { $in: ids } }).toArray() },
  async createSession(session: Omit<AdminSession, "_id">) { await getAdminSessionsCollection(await getMongoDb()).insertOne(session as AdminSession) },
  async findSession(sessionId: string) { return getAdminSessionsCollection(await getMongoDb()).findOne({ sessionId }) },
  async revokeSession(sessionId: string) { await getAdminSessionsCollection(await getMongoDb()).updateOne({ sessionId }, { $set: { revokedAt: new Date() } }) },
  async recordLogin(id: ObjectId) { await getAdminUsersCollection(await getMongoDb()).updateOne({ _id: id }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }) },
}
