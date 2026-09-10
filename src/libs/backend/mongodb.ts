import "server-only"

import { Db, MongoClient } from "mongodb"

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient> | undefined

function createClient() {
  const uri = process.env.MONGO_URL

  if (!uri) {
    throw new Error("MONGO_URL is not set.")
  }

  return new MongoClient(uri).connect()
}

/**
 * Returns the shared MongoDB client for server-side code.
 *
 * The development cache prevents a new connection whenever Next reloads a
 * module. The environment is evaluated lazily so routes that do not need the
 * database, such as `/api/health`, remain available without `MONGO_URL`.
 */
export function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    globalThis.mongoClientPromise ??= createClient()
    return globalThis.mongoClientPromise
  }

  clientPromise ??= createClient()
  return clientPromise
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient()
  return client.db()
}
