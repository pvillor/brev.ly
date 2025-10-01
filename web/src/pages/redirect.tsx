import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getOriginalUrlByShortUrlSuffix } from "../http/get-original-url-by-short-url-suffix"
import { useEffect } from "react"
import { AxiosError } from "axios"
import logoIcon from '../assets/logo-icon.svg'

type RedirectParams = {
  shortUrlSuffix: string
}

export function Redirect() {
  const params = useParams<RedirectParams>()
  const navigate = useNavigate()

  const { data: originalUrl } = useQuery({
    queryKey: ['link', params.shortUrlSuffix],
    queryFn: async () => {
      try {
        return await getOriginalUrlByShortUrlSuffix(params.shortUrlSuffix as string)
      } catch (error) {
        if (error instanceof AxiosError && error.status === 404) {
          navigate('not-found')
        } 
      }
    },
    enabled: !!params.shortUrlSuffix,
  })
  
  useEffect(() => {
    if (originalUrl) {
      window.location.href = originalUrl
    }
  }, [originalUrl])

  const baseUrl = import.meta.env.VITE_FRONTEND_URL

  return (
    <div className="flex flex-col items-center gap-6 px-5 py-12 bg-gray-100 rounded-lg">
      <img src={logoIcon} width={48} />

      <h1 className="text-2xl font-bold">Redirecionando...</h1>

      <div className="space-y-1">
        <p className="text-center text-gray-500 text-sm font-semibold break-words">O link será aberto automaticamente em alguns instantes.</p>
        <p className="text-center text-gray-500 text-sm font-semibold">Não foi redirecionado? <a href={baseUrl} className="text-blue-base underline">Acesse aqui</a></p>
      </div>
    </div>
  )
}