import { getOriginalUrlByShortUrlSuffix } from "@/app/functions/get-original-url-by-short-url-suffix";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getOriginalUrlByShortUrlSuffixRoute: FastifyPluginAsyncZod = async app => {
  app.get('/links/:suffix', {
    schema: {
      params: z.object({
        suffix: z.string()
      })
    }
  }, async (request, reply) => {
    const { suffix } = request.params

    const originalUrl = await getOriginalUrlByShortUrlSuffix({
      suffix
    })

    return reply.status(200).send({ originalUrl })
  })
}