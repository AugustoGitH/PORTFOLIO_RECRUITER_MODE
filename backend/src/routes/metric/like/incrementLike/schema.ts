import { Type } from '@sinclair/typebox'
import { type FastifySchema } from 'fastify'


const metricsResponseSchema = Type.Object({

})

export const incrementLikeSchema: FastifySchema = {
  response: { 200: metricsResponseSchema },
}
