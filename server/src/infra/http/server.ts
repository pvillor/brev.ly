import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { env } from "@/env.ts";
import { hasZodFastifySchemaValidationErrors, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { createLinkRoute } from "./routes/create-link";
import { ConflictException } from "@/app/functions/errors/conflict";

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  if (error instanceof ConflictException) {
    return reply.status(409).send({
      message: error.message
    })
  }

  // send to observability tool
  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})

app.register(fastifyCors, {
  origin: '*'
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createLinkRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 Link start!')
})