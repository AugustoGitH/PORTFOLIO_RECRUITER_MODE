import { type FastifySchema } from 'fastify'

import { metricsResponseSchema } from '../../../lib/metrics/schema'

export const getMetricsSchema: FastifySchema = {
  response: { 200: metricsResponseSchema },
}
