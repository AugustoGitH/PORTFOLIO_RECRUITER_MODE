import { type FastifySchema } from 'fastify'

import { metricsResponseSchema } from '../../../../lib/metrics/schema'

// No body needed: the route (/view) already identifies the counter.
export const incrementViewSchema: FastifySchema = {
  response: { 200: metricsResponseSchema },
}
