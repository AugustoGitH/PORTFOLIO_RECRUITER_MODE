import "server-only"

import type { Collection, Db } from "mongodb"

import type { MongoDocument } from "@backend/libs/db/mongo"

export type Like = MongoDocument & {
  visitorId: string
}

export function getLikesCollection(db: Db): Collection<Like> {
  return db.collection<Like>("likes")
}
