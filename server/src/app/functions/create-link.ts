import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import z from "zod";
import { ConflictException } from "./errors/conflict";

const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrlSuffix: z.string()
    .regex(/^[a-zA-Z0-9-]+$/),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(input: CreateLinkInput) {
  const { originalUrl, shortUrlSuffix } = createLinkInput.parse(input)

  const [shortUrlSuffixAlreadyExists] = await db.select()
    .from(schema.links)
    .where(eq(schema.links.shortUrlSuffix, shortUrlSuffix))

  if (shortUrlSuffixAlreadyExists) {
    throw new ConflictException('Essa URL encurtada já existe.')
  }

  const [link] = await db.insert(schema.links).values({
    originalUrl,
    shortUrlSuffix
  }).returning()

  return ({ linkId: link.id })
}