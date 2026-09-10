import "server-only"

import type { Collection, Db } from "mongodb"

import type { MongoDocument } from "./types"

export enum ViewType {
  Portfolio,
  Resume,
}

export type View = MongoDocument & {
  type: ViewType
  visitorId: string
}

export function getViewsCollection(db: Db): Collection<View> {
  return db.collection<View>("views")
}
