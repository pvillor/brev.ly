import { api } from "../lib/axios"

interface GetOriginalUrlByShortUrlSuffixResponse {
  originalUrl: string
}

export async function getOriginalUrlByShortUrlSuffix(suffix: string) {
  const { data } = await api.get<GetOriginalUrlByShortUrlSuffixResponse>(`/links/${suffix}`)

  return data.originalUrl
}