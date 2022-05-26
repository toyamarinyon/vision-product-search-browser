import type { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '../../layouts'
import { Td, Th } from '../../layouts/table'
import { trpc } from '../../utils/trpc'
import { formatIndexTime } from '../../utils/formatIndexTime'

const Home: NextPage = () => {
  const productSetsQuery = trpc.useQuery(['productSet.findMany'])

  return (
    <Layout>
      {productSetsQuery.isLoading ? (
        <table className="table-auto w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Display Name</Th>
              <Th>Index Time</Th>
              <Th>Index Error</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <div className="h-2 w-24 bg-slate-200 rounded"></div>
              </Td>
              <Td>
                <div className="h-2 w-24 bg-slate-200 rounded"></div>
              </Td>
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
          </tbody>
        </table>
      ) : (
        <table className="table-auto w-full text-sm border-collapse">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Display Name</Th>
              <Th>Index Time</Th>
              <Th>Index Error</Th>
            </tr>
          </thead>
          <tbody>
            {productSetsQuery.data?.productSetCollection?.map((productSet) => (
              <tr key={productSet.name}>
                <Td>
                  <Link
                    href={`/productSets/${productSet.name?.split('/').pop()}`}
                  >
                    <a className="cursor-pointer hover:text-indigo-500 hover:underline">
                      {productSet.name?.split('/').pop()}
                    </a>
                  </Link>
                </Td>
                <Td>{productSet.displayName}</Td>
                <Td>{formatIndexTime(productSet.indexTime)}</Td>
                <Td>
                  {productSet.indexError == null ||
                  productSet.indexError?.code == 0
                    ? 'No error'
                    : JSON.stringify(productSet.indexError)}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}

export default Home
