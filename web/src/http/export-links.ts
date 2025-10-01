import { api } from "../lib/axios"

interface ExportLinksResponse {
  fileUrl: string
}

export async function exportLinks() {
  const { data } = await api.post<ExportLinksResponse>('/links/exports')

  return data
}