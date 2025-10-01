import { exportLinks } from "@/app/functions/export-links";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const exportLinksRoute: FastifyPluginAsyncZod = async app => {
  app.post('/links/exports', {
    schema: {}
  }, async (_, reply) => {
     const { fileUrl } = await exportLinks()

    return reply.status(200).send({ fileUrl })
  })
}