import { type RouteHandler } from 'fastify'

import { incrementMetric } from '../../../../lib/metrics/store'

// Controller: atomically bumps the `views` counter and returns the fresh totals.
export const incrementViewHandler: RouteHandler = async (request) => {
  return incrementMetric(request.server.mongo.db!, 'views')
}
