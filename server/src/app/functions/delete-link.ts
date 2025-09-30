import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import z from "zod";
import { NotFoundException } from "./errors/not-found";

const deleteLinkInput = z.object({
  linkId: z.uuidv7(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(input: DeleteLinkInput) {
  const { linkId } = deleteLinkInput.parse(input)

  const [link] = await db.select()
    .from(schema.links)
    .where(eq(schema.links.id, linkId))

  if (!link) {
    throw new NotFoundException('Link não encontrado.')
  }

  await db.delete(schema.links).where(eq(schema.links.id, link.id))
}