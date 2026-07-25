import { join } from 'node:path'
import { existsSync } from 'node:fs'
import fp from 'fastify-plugin'
import fastifyStatic from '@fastify/static'

// Serves the built frontend (Vite output) and falls back to index.html so
// client-side routing works. The frontend must be built first (`npm run build`
// in /frontend) — its output lives in /frontend/dist.
//
// The path can be overridden with the FRONTEND_DIST env var; otherwise it is
// resolved relative to the compiled backend (dist/plugins -> ../../../frontend/dist).
export default fp(async (fastify) => {
  const frontendDist =
    process.env.FRONTEND_DIST ??
    join(__dirname, '..', '..', '..', 'frontend', 'dist')

  if (!existsSync(join(frontendDist, 'index.html'))) {
    fastify.log.warn(
      `Frontend build not found at ${frontendDist}. ` +
        'Run the frontend build (npm run build) so the backend can serve it.'
    )
    return
  }

  void fastify.register(fastifyStatic, {
    root: frontendDist,
    wildcard: false
  })

  // SPA fallback: any unmatched GET that is not an API call returns index.html.
  fastify.setNotFoundHandler((request, reply) => {
    if (request.method === 'GET' && !request.url.startsWith('/api')) {
      return reply.sendFile('index.html')
    }
    return reply.code(404).send({ message: 'Not Found' })
  })
})
