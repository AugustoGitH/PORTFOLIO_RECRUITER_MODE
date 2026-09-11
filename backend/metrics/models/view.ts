import "server-only"

import type { Collection, Db } from "mongodb"

import type { MongoDocument } from "@backend/libs/db/mongo"

export enum ViewType {
  Portfolio,
  Resume,
}

export type View = MongoDocument & {
  type: ViewType
  visitorId: string
  dedupeKey: string
  locale?: string
  slug?: string
}

export function getViewsCollection(db: Db): Collection<View> {
  return db.collection<View>("views")
}
