import notFound from '../assets/not-found.png'

export function NotFound() {
  const baseUrl = import.meta.env.VITE_FRONTEND_URL

  return (
    <div className="min-h-screen flex flex-col px-3 py-8 justify-center items-center">
      <div className="flex flex-col items-center gap-6 px-5 py-12 bg-gray-100 rounded-lg max-w-xl">
        <img src={notFound} width={162} />

        <h1 className="text-2xl font-bold">Link não encontrado</h1>

        <div className="space-y-1">
          <p className="text-center text-gray-500 text-sm font-semibold">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <a href={baseUrl} className="text-blue-base underline">brev.ly</a>.</p>
        </div>
      </div>
    </div>
  )
}