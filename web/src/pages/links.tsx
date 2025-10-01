import { useForm } from 'react-hook-form'
import logo from '../../public/logo.png'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLink, createLinkInput, type CreateLinkInput } from '../http/create-link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

export function Links() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkInput)
  })

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      toast.success('Link criado com sucesso!')
    },
    onError: (error: AxiosError) => {
      switch (error.status) {
        case 409:
          toast.error('Essa URL encurtada já existe.')
          break
        default:
          toast.error('Erro ao criar link.')
      }
    }
  })

  async function handleCreateLink({ originalUrl, shortUrlSuffix }: CreateLinkInput) {
    await createLinkFn({
      originalUrl,
      shortUrlSuffix
    })

    reset()
  }

  const { originalUrl, shortUrlSuffix } = watch()

  const isSomeInputEmpty = !originalUrl?.trim() || !shortUrlSuffix?.trim()

  return (
    <div className="min-h-screen flex flex-col items-center gap-6">
      <img src={logo} />

      <form onSubmit={handleSubmit(handleCreateLink)} className='bg-gray-100 rounded-lg flex flex-col gap-5 p-6'>
        <h1 className='text-lg font-bold leading-6'>Novo link</h1>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2 text-gray-500 focus-within:text-blue-base focus-within:font-semibold'>
            <label className='uppercase text-xxs leading-3.5' htmlFor='originalUrl'>Link original</label>

            <input placeholder='www.exemplo.com.br' className='rounded-lg px-4 py-[15px] border border-gray-300 text-gray-600 text-sm caret-blue-base placeholder:text-sm placeholder:text-gray-400 placeholder:leading-[18px] outline-none focus:border-blue-base focus:border-2' {...register('originalUrl')} />
          </div>

          <div className='flex flex-col gap-2 text-gray-500 focus-within:text-blue-base focus-within:font-semibold'>
            <label className='uppercase text-xxs leading-3.5' htmlFor='shortUrlSuffix'>Link encurtado</label>

            <div className='flex rounded-lg px-4 py-[15px] border border-gray-300 focus-within:border-blue-base focus-within:border-2'>
              <span className='text-sm text-gray-400 leading-[18px]'>brev.ly/</span>

              <input className='flex-1 text-gray-600 text-sm caret-blue-base leading-[18px] outline-none' {...register('shortUrlSuffix')} />
            </div>
          </div>
        </div>

        <button type='submit' className='bg-blue-base text-white rounded-lg py-[15px] disabled:opacity-50' disabled={isSomeInputEmpty || isPending}>
          {isPending ? 'Salvando...' : 'Salvar link'}
        </button>
      </form>
    </div>
  )
}