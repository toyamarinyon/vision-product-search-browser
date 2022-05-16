import type { NextPage } from 'next'
import { Table } from '../../components/productCollection'
import { Layout } from '../../layouts'
import { trpc } from '../../utils/trpc'

const Home: NextPage = () => {
  const productsQuery = trpc.useQuery(['product.findMany'])

  return (
    <Layout>
      <Table
        productCollection={productsQuery.data?.productCollection ?? []}
        isLoading={productsQuery.isLoading}
      />
    </Layout>
  )
}

export default Home
