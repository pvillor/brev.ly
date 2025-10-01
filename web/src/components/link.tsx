import { CopyIcon, TrashIcon } from "@phosphor-icons/react"

interface LinkProps {
  originalUrl: string
  shortUrlSuffix: string
  accessCount: number
}

export function Link({ originalUrl, shortUrlSuffix, accessCount }: LinkProps) {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL

  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-blue-base text-sm font-semibold leading-[18px] truncate">{`${baseUrl}/${shortUrlSuffix}`}</p>

          <span className="text-gray-500 text-xs truncate">{originalUrl}</span>
        </div>

        <span className="text-gray-500 text-xs shrink-0">{accessCount} acessos</span>

        <div className="flex gap-1 shrink-0">
          <button className="rounded-sm bg-gray-200 text-gray-600 p-2">
            <CopyIcon size={16} />
          </button>

          <button className="rounded-sm bg-gray-200 text-gray-600 p-2">
            <TrashIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}