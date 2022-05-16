import type { NextPage } from 'next'
import Link from 'next/link'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  // const query = trpc.useQuery(['productSet.findMany'])
  const productSetsQuery = trpc.useQuery(['productSet.findMany'])
  const productsQuery = trpc.useQuery(['product.findMany'])

  if (productSetsQuery.isLoading || productsQuery.isLoading) {
    return <div>loading...</div>
  }
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {productSetsQuery.data?.productSetCollection?.map((productSet) => (
        <div key={productSet.name}>
          <Link href={`/productSets/${productSet.name?.split('/').pop()}`}>
            <a>{productSet.name}</a>
          </Link>
        </div>
      ))}
      <hr />
      {productsQuery.data?.productCollection?.map((product) => (
        <div key={product.name}>
          <Link href={`/products/${product.name?.split('/').pop()}`}>
            <a>
              {product.name}/<span>{product.displayName}</span>
            </a>
          </Link>
        </div>
      ))}
    </main>
  )
}

export default Home
