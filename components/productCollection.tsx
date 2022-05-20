import Link from 'next/link'
import { useState } from 'react'
import { NothingTd, Td, Th } from '../layouts/table'
import { trpc } from '../utils/trpc'

interface Product {
  name: string | null | undefined
  displayName: string | null | undefined
}

export function ProductCollectionTable({
  productSetName,
}: {
  productSetName?: string
}) {
  const [pageToken, setPageToken] = useState<string>()
  const productsQuery = trpc.useQuery([
    'product.findMany',
    { pageToken, productSetName },
  ])

  return (
    <Table
      productCollection={productsQuery.data?.productCollection ?? []}
      isLoading={productsQuery.isLoading}
      hasNextPage={productsQuery.data?.nextPageToken != ''}
      onNextPageButtonClick={() => {
        if (productsQuery.data?.nextPageToken == null) {
        } else {
          setPageToken(productsQuery.data.nextPageToken)
        }
      }}
    />
  )
}

interface TableProps {
  isLoading: boolean
  productCollection: Product[]
  hasNextPage: boolean
  onNextPageButtonClick: () => void
}
export function Table({
  productCollection,
  isLoading,
  onNextPageButtonClick,
  hasNextPage,
}: TableProps) {
  if (isLoading) {
    return (
      <table className="table-auto w-full text-sm border-collapse">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Display Name</Th>
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
    )
  }
  return (
    <section className="space-y-2 pb-6">
      <table className="table-auto w-full text-sm border-collapse">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Display Name</Th>
          </tr>
        </thead>
        <tbody>
          {productCollection.length == 0 ? (
            <NothingTd
              colspan={2}
              message="There are no registered products in this product set."
            />
          ) : (
            <>
              {productCollection.map((product) => (
                <tr key={product.name}>
                  <Td>
                    <Link href={`/products/${product.name?.split('/').pop()}`}>
                      <a className="cursor-pointer hover:text-indigo-500 hover:underline">
                        {product.name?.split('/').pop()}
                      </a>
                    </Link>
                  </Td>
                  <Td>{product.displayName}</Td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
      <nav className="flex justify-end">
        <button
          className="rounded-lg px-3 py-1 text-gray-700 border border-400 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
          onClick={() => onNextPageButtonClick()}
          disabled={!hasNextPage}
        >
          Next
        </button>
      </nav>
    </section>
  )
}
