import { useForm } from 'react-hook-form'
import logo from '../assets/logo.png'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLink, createLinkInput, type CreateLinkInput } from '../http/create-link'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { DownloadSimpleIcon, LinkIcon, WarningIcon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'
import { getLinks } from '../http/get-links'
import { Link } from '../components/link'
import { exportLinks } from '../http/export-links'
import { downloadUrl } from '../utils/download-url'
import { queryClient } from '../lib/react-query'
import { motion } from 'framer-motion'

export function Links() {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkInput)
  })

  const { mutateAsync: createLinkFn, isPending: isCreatingLink } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })

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

  const { data: links, isFetching } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks
  })

  const { mutateAsync: exportLinksFn, isPending: isExportingLinks } = useMutation({
    mutationFn: exportLinks
  })

  async function handleCreateLink({ originalUrl, shortUrlSuffix }: CreateLinkInput) {
    await createLinkFn({
      originalUrl,
      shortUrlSuffix
    })

    reset()
  }

  async function handleExportLinks() {
    const { fileUrl } = await exportLinksFn()

    downloadUrl(fileUrl)
  }

  const { originalUrl, shortUrlSuffix } = watch()

  const isSomeInputEmpty = !originalUrl?.trim() || !shortUrlSuffix?.trim()

  return (
    <div className="flex-1 flex flex-col items-center gap-6 md:items-start">
      <img src={logo} />

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <form onSubmit={handleSubmit(handleCreateLink)} className='bg-gray-100 rounded-lg flex flex-col gap-5 p-6 w-full md:min-w-96 md:p-8'>
          <h1 className='text-lg font-bold leading-6'>Novo link</h1>

          <div className='flex flex-col gap-4'>
            <div className={twMerge('flex flex-col gap-2 text-gray-500 focus-within:text-blue-base focus-within:font-semibold', !!errors.originalUrl && 'text-danger font-semibold')}>
              <label className='uppercase text-xxs leading-3.5' htmlFor='originalUrl'>Link original</label>

              <div className='flex flex-col gap-2'>
                <input
                  placeholder='www.exemplo.com.br' 
                  className={twMerge('rounded-lg px-4 py-[15px] border border-gray-300 text-gray-600 text-sm caret-blue-base placeholder:text-sm placeholder:text-gray-400 placeholder:leading-[18px] outline-none focus:border-blue-base focus:border-2', !!errors.originalUrl && 'border-danger border-2')} 
                  {...register('originalUrl')} 
                />

                {!!errors.originalUrl && (
                  <span className='text-gray-500 text-xs leading-4 font-normal flex gap-2'>
                    <WarningIcon size={16} className='text-danger' />
                    {errors.originalUrl.message}
                  </span>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-2 text-gray-500 focus-within:text-blue-base focus-within:font-semibold'>
              <label className='uppercase text-xxs leading-3.5' htmlFor='shortUrlSuffix'>Link encurtado</label>

              <div className='flex flex-col gap-2'>
                <div className='flex rounded-lg px-4 py-[15px] border border-gray-300 focus-within:border-blue-base focus-within:border-2'>
                  <span className='text-sm text-gray-400 leading-[18px]'>brev.ly/</span>

                  <input className='flex-1 text-gray-600 text-sm caret-blue-base leading-[18px] outline-none' {...register('shortUrlSuffix')} />         
                </div>
                
                {!!errors.shortUrlSuffix && (
                  <span className='text-gray-500 text-xs leading-4 font-normal flex gap-2'>
                    <WarningIcon size={16} className='text-danger' />
                    {errors.shortUrlSuffix.message}
                  </span>
                )}   
              </div>
            </div>
          </div>

          <button type='submit' className='bg-blue-base text-white rounded-lg py-[15px] disabled:opacity-50 hover:bg-blue-dark hover:cursor-pointer' disabled={isSomeInputEmpty || isCreatingLink}>
            {isCreatingLink ? 'Salvando...' : 'Salvar link'}
          </button>
        </form>

        <div
          className="bg-gray-100 rounded-lg flex flex-col gap-4 p-6 w-full relative md:min-w-xl md:p-8"
        >
          {isFetching && (
            <motion.div
              className="absolute top-0 left-0 h-1 bg-blue-dark rounded-tr rounded-tl w-1/4"
              initial={{ x: '0%' }}
              animate={{ x: '300%' }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
            />
          )}

          <div className='flex justify-between items-center'>
            <h1 className='text-lg font-bold leading-6'>Meus links</h1>
            
            <button
              className='bg-gray-200 text-gray-500 text-xs font-semibold leading-4 rounded-sm p-2 flex items-center gap-1.5 disabled:opacity-50'
              disabled={isExportingLinks || links?.length === 0}
              onClick={handleExportLinks}
            >
              <DownloadSimpleIcon size={16} className='text-gray-600' />
              Baixar CSV
            </button>
          </div>

          {(!!links && links.length > 0) ? (
            <div className='space-y-3'>
              {links.map(link => (
                <Link
                  key={link.id}
                  id={link.id}
                  originalUrl={link.originalUrl} 
                  shortUrlSuffix={link.shortUrlSuffix} 
                  accessCount={link.accessCount} 
                />
              ))}
            </div>
          ) : (
            <div className='border-t border-gray-200 text-gray-400 flex flex-col justify-center items-center gap-3 py-4'>
              <LinkIcon size={32} />
              <h3 className='uppercase font-semibold text-xxs text-gray-500'>ainda não existem links cadastrados</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}