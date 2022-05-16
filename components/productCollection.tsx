import Link from 'next/link'
import { NothingTd, Td, Th } from '../layouts/table'

interface Product {
  name: string | null | undefined
  displayName: string | null | undefined
}
interface TableProps {
  isLoading: boolean
  productCollection: Product[]
}
export function Table({ productCollection, isLoading }: TableProps) {
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
    <table className="table-auto w-full text-sm border-collapse">
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Display Name</Th>
        </tr>
      </thead>
      <tbody>
        {productCollection.length == 0 ? (
          <NothingTd colspan={2} message="There are no registered products in this product set." />
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
  )
}
