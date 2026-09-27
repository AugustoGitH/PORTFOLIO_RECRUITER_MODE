import "server-only"

import { getVerifiedAdminSession } from "@backend/admin/authorization"
import {
  listPublicRateLimitBuckets,
  resetRateLimit,
} from "./main"
import type { RateLimitDimension } from "./types"

const noStore = { "Cache-Control": "no-store" }
const publicDimensions: RateLimitDimension[] = ["ip", "visitor"]

const authorize = async () => {
  const session = await getVerifiedAdminSession()

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: noStore },
    )
  }
  if (!session.permissions.includes("rate-limits.manage")) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: noStore },
    )
  }

  return null
}

export const publicRateLimitAdminController = {
  async list() {
    const authorizationError = await authorize()
    if (authorizationError) return authorizationError

    const buckets = await listPublicRateLimitBuckets()

    return Response.json(buckets.map((bucket) => ({
      scope: bucket.scope,
      dimension: bucket.dimension,
      identifier: bucket.identifier,
      count: bucket.count,
      limit: bucket.limit,
      isBlocked: bucket.count >= bucket.limit,
      lastAttemptAt: bucket.lastAttemptAt.toISOString(),
      expiresAt: bucket.expiresAt.toISOString(),
    })), { headers: noStore })
  },
  async reset(request: Request) {
    const authorizationError = await authorize()
    if (authorizationError) return authorizationError

    const body = await request.json().catch(() => null)
    if (
      !body
      || typeof body.scope !== "string"
      || body.scope === "admin-login"
      || body.scope.length < 1
      || body.scope.length > 100
      || !publicDimensions.includes(body.dimension)
      || typeof body.identifier !== "string"
      || body.identifier.length < 1
      || body.identifier.length > 255
    ) {
      return Response.json(
        { error: "Invalid rate limit" },
        { status: 400, headers: noStore },
      )
    }

    await resetRateLimit(body.scope, body.dimension, body.identifier)
    return new Response(null, { status: 204, headers: noStore })
  },
}
