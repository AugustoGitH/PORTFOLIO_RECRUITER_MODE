import { type FastifyPluginAsync } from 'fastify'

// API routes live under /api so that `/` and other paths are free to be served
// by the frontend (see plugins/static.ts). Resource routes (e.g. metrics) are
// autoloaded from their own folders — this file only holds top-level endpoints.
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/api/health', async function () {
    return { status: 'ok' }
  })
}

export default root
