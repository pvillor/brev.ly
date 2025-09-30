import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import z from "zod";
import { NotFoundException } from "./errors/not-found";

const getOriginalUrlByShortUrlSuffixInput = z.object({
  suffix: z.string(),
})

type GetOriginalUrlByShortUrlSuffixInput = z.input<typeof getOriginalUrlByShortUrlSuffixInput>

export async function getOriginalUrlByShortUrlSuffix(input: GetOriginalUrlByShortUrlSuffixInput) {
  const { suffix } = getOriginalUrlByShortUrlSuffixInput.parse(input)

  const [link] = await db.select()
    .from(schema.links)
    .where(eq(schema.links.shortUrlSuffix, suffix))

  if (!link) {
    throw new NotFoundException('Link não encontrado.')
  }

  return link.originalUrl
}