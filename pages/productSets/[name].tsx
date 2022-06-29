import type { NextPage } from 'next'
import cl from 'classnames'
import { useRouter } from 'next/router'
import { ProductCollectionTable } from '../../components/productCollection'
import { Layout } from '../../layouts'
import { InferMutationOutput, trpc } from '../../utils/trpc'
import { formatIndexTime } from '../../utils/formatIndexTime'
import { useState, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { SearchResult } from '../../components/searchResult'

const resizeImageSize = 700
async function fileToBase64(file: File): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (readerEvent) => {
      const img = document.createElement('img')
      img.onload = (event) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const resizeRatio =
          img.width > img.height
            ? resizeImageSize / img.width
            : resizeImageSize / img.height
        canvas.width = img.width * resizeRatio
        canvas.height = img.height * resizeRatio
        ctx?.drawImage(
          img,
          0,
          0,
          img.width * resizeRatio,
          img.height * resizeRatio
        )
        const dataUrl = canvas.toDataURL(file.type)
        resolve([dataUrl.replace(/^data:.+;base64,/, ''), dataUrl])
      }
      img.src = readerEvent.target?.result as string
      // const { result } = reader
      // if (typeof result == 'string') {
      //   resolve(result.replace(/^data:.+;base64,/, ''))
      // } else {
      //   reject(new Error('Unexpected file reader result'))
      // }
    }
    reader.onerror = (error) => reject(error)
  })
}

type SearchState = 'searching' | 'found' | 'notFound' | 'idle'
const ShowProductSetPage: NextPage = () => {
  const router = useRouter()
  const productSetName = router.query.name as string
  const query = trpc.useQuery(['productSet.find', { productSetName }])
  const imageAnnotator = trpc.useMutation(['productSet.annotate'])
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [searchResult, setSearchResult] =
    useState<InferMutationOutput<'productSet.annotate'>>()
  const [searchImageEncodedBase64, setSearchImageEncodedBase64] =
    useState<string>()
  const resetSearch = () => {
    setSearchState('idle')
    if (inputFileRef.current == null) {
      return
    }
    inputFileRef.current.value = ''
  }

  return (
    <Layout>
      <>
        <section className="p-6">
          <table>
            <thead>
              <tr>
                <th className="pr-4 text-left font-bold text-gray-600 text-sm">
                  Name
                </th>
                <th className="pr-4 text-left font-bold text-gray-600 text-sm">
                  Display Name
                </th>
                <th className="pr-4 text-left font-bold text-gray-600 text-sm">
                  Index Time
                </th>
                <th className="pr-4 text-left font-bold text-gray-600 text-sm">
                  Index Error
                </th>
                <th className="pr-4 text-left font-bold text-gray-600 text-sm">
                  Try to Search
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    query.data?.productSet.name?.split('/').pop()
                  )}
                </td>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    query.data?.productSet.displayName
                  )}
                </td>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    formatIndexTime(query.data?.productSet.indexTime)
                  )}
                </td>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    query.data?.productSet.indexError?.message
                  )}
                </td>
                <td className="pr-4 text-sm text-gray-700">
                  <input
                    ref={inputFileRef}
                    className={cl({
                      hidden: searchState !== 'idle',
                    })}
                    type="file"
                    onChange={async (e) => {
                      if (e.target.files == null) {
                        return
                      }
                      const file = e.target.files[0]

                      const fileSizeMegabytes = file.size / 1024 / 1024
                      if (fileSizeMegabytes > 3) {
                        alert(
                          'File too large. Please select a file less than 3MB'
                        )
                        resetSearch()
                        return
                      }
                      if (
                        file.type !== 'image/jpeg' &&
                        file.type !== 'image/png'
                      ) {
                        alert(
                          'File type not supported. Please select a jpeg or png file'
                        )
                        resetSearch()
                        return
                      }

                      setSearchState('searching')
                      const [fileEncodedBase64ForHttp, fileEncodedBase64] =
                        await fileToBase64(e.target.files[0])
                      const result = await imageAnnotator.mutateAsync({
                        productSetName,
                        fileEncodedBase64: fileEncodedBase64ForHttp,
                      })
                      setSearchImageEncodedBase64(fileEncodedBase64)
                      setSearchState('found')
                      setSearchResult(result)
                    }}
                  />
                  {searchState === 'searching' && 'Searching...'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <h2 className="font-bold text-gray-600 text-sm ml-6">Products</h2>
        <ProductCollectionTable productSetName={productSetName} />
        <Transition.Root show={searchState === 'found'} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => resetSearch()}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => resetSearch()}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Search Result
                          </Dialog.Title>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <SearchResult
                            data={searchResult}
                            searchImageEncodedBase64={searchImageEncodedBase64}
                          />
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    </Layout>
  )
}

export default ShowProductSetPage
