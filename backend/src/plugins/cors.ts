import fp from 'fastify-plugin'
import { FastifySensibleOptions } from '@fastify/sensible'
import cors from "@fastify/cors";


export default fp<FastifySensibleOptions>(async (fastify) => {
   fastify.register(cors, {
  origin: "http://localhost:5173",
});
})
