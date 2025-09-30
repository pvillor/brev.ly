import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import z from "zod";

const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrl: z.url(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(input: CreateLinkInput) {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  const [link] = await db.insert(schema.links).values({
    originalUrl,
    shortUrl
  }).returning()

  return ({ linkId: link.id })
}