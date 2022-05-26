import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  ProductCollectionTable,
  Table,
} from '../../components/productCollection'
import { Layout } from '../../layouts'
import { trpc } from '../../utils/trpc'
import { formatIndexTime } from '../../utils/formatIndexTime'

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const { result } = reader
      if (typeof result == 'string') {
        resolve(result.replace(/^data:.+;base64,/, ''))
      } else {
        reject(new Error('Unexpected file reader result'))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

const ShowProductSetPage: NextPage = () => {
  const router = useRouter()
  const productSetName = router.query.name as string
  const query = trpc.useQuery(['productSet.find', { productSetName }])

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
              </tr>
            </tbody>
          </table>
        </section>
        <h2 className="font-bold text-gray-600 text-sm ml-6">Products</h2>
        <ProductCollectionTable productSetName={productSetName} />
      </>
    </Layout>
  )
}

export default ShowProductSetPage
