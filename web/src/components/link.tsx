import { CopyIcon, TrashIcon } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import { deleteLink } from "../http/delete-link"
import { queryClient } from "../lib/react-query"

interface LinkProps {
  id: string
  originalUrl: string
  shortUrlSuffix: string
  accessCount: number
}

export function Link({ id, originalUrl, shortUrlSuffix, accessCount }: LinkProps) {
  const { mutateAsync: deleteLinkFn, isPending: isDeletingLink } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })

      toast.success('Link excluído com sucesso!')
    },
    onError: (error: AxiosError) => {
      switch (error.status) {
        case 404:
          toast.error('Link não encontrado.')
          break
        default:
          toast.error('Erro ao deletar link.')
      }
    }
  })
  
  function handleCopyLink() {
    navigator.clipboard.writeText(shortUrl)

    toast.info('Link copiado para a área de referência')
  }

  async function handleDeleteLink() {
    const confirmDeleting = window.confirm('Tem certeza que deseja deletar este link?')
    
    if (!confirmDeleting) return

    await deleteLinkFn(id)
  }

  const baseUrl = import.meta.env.VITE_FRONTEND_URL
  const shortUrl = `${baseUrl}/${shortUrlSuffix}`

  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-blue-base text-sm font-semibold leading-[18px] truncate">{shortUrl}</p>

          <span className="text-gray-500 text-xs truncate">{originalUrl}</span>
        </div>

        <span className="text-gray-500 text-xs shrink-0">{accessCount} acessos</span>

        <div className="flex gap-1 shrink-0">
          <button className="rounded-sm bg-gray-200 text-gray-600 p-2 hover:border hover:border-blue-base hover:cursor-pointer" onClick={handleCopyLink}>
            <CopyIcon size={16} />
          </button>

          <button className="rounded-sm bg-gray-200 text-gray-600 p-2 hover:border hover:border-blue-base hover:cursor-pointer" disabled={isDeletingLink} onClick={handleDeleteLink}>
            <TrashIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}