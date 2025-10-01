import { z } from "zod"
import { api } from "../lib/axios"

export const createLinkInput = z.object({
  originalUrl: z.url(),
  shortUrlSuffix: z.string(),
})

export type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink({ originalUrl, shortUrlSuffix }: CreateLinkInput) {
  await api.post('/links', {
    originalUrl,
    shortUrlSuffix
  })
}