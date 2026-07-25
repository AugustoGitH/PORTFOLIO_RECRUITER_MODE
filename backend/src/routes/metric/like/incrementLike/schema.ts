import { type FastifySchema } from 'fastify'

import { metricsResponseSchema } from '../../../../lib/metrics/schema'

// No body needed: the route (/like) already identifies the counter.
export const incrementLikeSchema: FastifySchema = {
  response: { 200: metricsResponseSchema },
}
