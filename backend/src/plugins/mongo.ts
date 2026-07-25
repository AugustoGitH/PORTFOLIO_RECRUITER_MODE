import fp from 'fastify-plugin'
import fastifyMongodb from '@fastify/mongodb'

/**
 * Registers the official MongoDB plugin. It decorates the instance with
 * `fastify.mongo` ({ client, db, ObjectId }), reused across the whole app.
 *
 * - Wrapped in `fastify-plugin` so the decorator escapes encapsulation.
 * - The connection string comes from MONGO_URL (loaded via dotenv in the
 *   start/dev scripts); the database name lives in the URL path.
 * - `forceClose` closes the client when Fastify shuts down.
 *
 * @see https://github.com/fastify/fastify-mongodb
 */
export default fp(async (fastify) => {
  const url = process.env.MONGO_URL

  if (!url) {
    throw new Error('MONGO_URL is not set — cannot connect to MongoDB.')
  }

  await fastify.register(fastifyMongodb, {
    forceClose: true,
    url,
  })
})
