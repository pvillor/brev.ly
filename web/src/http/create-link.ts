import { z } from "zod"
import { api } from "../lib/axios"

export const createLinkInput = z.object({
  originalUrl: z.url('Insira uma URL válida'),
  shortUrlSuffix: z.string()
    .min(1, 'Insira um link encurtado')
    .regex(/^[a-zA-Z0-9-]+$/, 'Insira uma url sem espaços e sem caracteres especiais'),
})

export type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink({ originalUrl, shortUrlSuffix }: CreateLinkInput) {
  await api.post('/links', {
    originalUrl,
    shortUrlSuffix
  })
}