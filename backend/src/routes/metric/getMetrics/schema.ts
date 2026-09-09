import { Type } from '@sinclair/typebox'
import { type FastifySchema } from 'fastify'


export const metricsResponseSchema = Type.Object({
  views: Type.Number(),
  likes: Type.Number(),
  professionalFeedbacks: Type.Number(),
  resumeViews: Type.Number()
})

export const getMetricsSchema: FastifySchema = {
  response: { 200: metricsResponseSchema },
}
