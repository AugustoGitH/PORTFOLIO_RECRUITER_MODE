import { type FastifyPluginAsync } from 'fastify'

import { getMetricsHandler } from './getMetrics/handler'
import { getMetricsSchema } from './getMetrics/schema'
import { incrementLikeHandler } from './like/incrementLike/handler'
import { incrementLikeSchema } from './like/incrementLike/schema'
import { incrementViewHandler } from './view/incrementView/handler'
import { incrementViewSchema } from './view/incrementView/schema'

// Autoload would prefix this folder with `/metric`; prefixOverride pins the full
// path so everything stays under `/api` (the frontend's axios baseURL is `/api`).
export const prefixOverride = '/api/metrics'

// Resource plugin: the single place that wires the metric controllers to routes.
// Each controller lives co-located under its action folder (handler + schema).
const metric: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', { schema: getMetricsSchema }, getMetricsHandler)
  fastify.post('/like', { schema: incrementLikeSchema }, incrementLikeHandler)
  fastify.post('/view', { schema: incrementViewSchema }, incrementViewHandler)
}

export default metric
