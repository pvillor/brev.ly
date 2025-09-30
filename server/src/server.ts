import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { env } from "@/env.ts";

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 Link start!')
})