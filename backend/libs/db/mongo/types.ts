import type { ObjectId } from "mongodb"

export type MongoDocument = {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}
