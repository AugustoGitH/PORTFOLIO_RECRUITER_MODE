import { type RouteHandler } from 'fastify'

import { incrementMetric } from '../../../../lib/metrics/store'

// Controller: atomically bumps the `likes` counter and returns the fresh totals.
export const incrementLikeHandler: RouteHandler = async (request) => {
  return incrementMetric(request.server.mongo.db!, 'likes')
}
