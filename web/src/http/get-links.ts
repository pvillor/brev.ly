import { api } from "../lib/axios";

export interface GetLinksResponse {
  links: {
    id: string
    originalUrl: string
    shortUrlSuffix: string
    accessCount: number
  }[]
}

export async function getLinks() {
  const { data } = await api.get<GetLinksResponse>('/links')

  return data.links
}