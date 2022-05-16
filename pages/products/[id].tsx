import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '../../layouts'
import { NothingTd, Td, Th } from '../../layouts/table'
import { trpc } from '../../utils/trpc'

const ShowProductPage: NextPage = () => {
  const router = useRouter()
  const query = trpc.useQuery([
    'product.find',
    { id: router.query.id as string },
  ])

  return (
    <Layout>
      <>
        <section className="p-6">
          <table>
            <thead>
              <tr>
                <th className="text-left font-bold text-gray-600 text-sm">
                  Name
                </th>
                <th className="text-left font-bold text-gray-600 text-sm">
                  Display Name
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    query.data?.name
                  )}
                </td>
                <td className="pr-4 text-sm text-gray-700">
                  {query.isLoading ? (
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  ) : (
                    query.data?.product.displayName
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <h2 className="font-bold text-gray-600 text-sm ml-6">
          Reference images
        </h2>
        <table className="table-auto w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Cloud Storage Uri</Th>
            </tr>
          </thead>
          <tbody>
            {query.isLoading ? (
              <>
                <tr>
                  <Td>
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  </Td>
                  <Td>
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  </Td>
                </tr>
                <tr>
                  <Td>
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  </Td>
                  <Td>
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                  </Td>
                </tr>
              </>
            ) : (
              <>
                {query.data?.referenceImages.length === 0 ? (
                  <tr>
                    <NothingTd
                      colspan={2}
                      message="There are no registered images. "
                    />
                  </tr>
                ) : (
                  <>
                    {query.data?.referenceImages?.map((referenceImage) => (
                      <tr key={referenceImage.name}>
                        <Td>{referenceImage.name?.split('/').pop()}</Td>
                        <Td>{referenceImage.uri}</Td>
                      </tr>
                    ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </>
    </Layout>
  )
}

export default ShowProductPage
