import { deleteLink } from "@/app/functions/delete-link";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.delete('/links/:linkId', {
    schema: {
      params: z.object({
        linkId: z.uuidv7()
      })
    }
  }, async (request, reply) => {
    const { linkId } = request.params

    await deleteLink({
      linkId
    })

    return reply.status(204).send()
  })
}