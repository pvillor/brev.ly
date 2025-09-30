import { getLinks } from "@/app/functions/get-links";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getLinksRoute: FastifyPluginAsyncZod = async app => {
  app.get('/links', {
    schema: {}
  }, async (_, reply) => {
     const links = await getLinks()

    return reply.status(200).send({ links })
  })
}