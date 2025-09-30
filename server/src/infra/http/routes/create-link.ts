import { createLink } from "@/app/functions/create-link";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async app => {
  app.post('/links', {
    schema: {
      body: z.object({
        originalUrl: z.url(),
        shortUrlSuffix: z.string(),
      })
    }
  }, async (request, reply) => {
    const { originalUrl, shortUrlSuffix } = request.body

    const { linkId } = await createLink({
      originalUrl,
      shortUrlSuffix
    })

    return reply.status(201).send({ linkId })
  })
}