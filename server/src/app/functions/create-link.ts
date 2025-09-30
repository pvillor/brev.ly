import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import z from "zod";
import { ConflictException } from "./errors/conflict";

const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrl: z.url(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(input: CreateLinkInput) {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  const [shortUrlAlreadyExists] = await db.select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))

    if (shortUrlAlreadyExists) {
      throw new ConflictException('Essa URL encurtada já existe.')
    }

  const [link] = await db.insert(schema.links).values({
    originalUrl,
    shortUrl
  }).returning()

  return ({ linkId: link.id })
}