import type { NextPage } from 'next'
import { ProductCollectionTable } from '../../components/productCollection'
import { Layout } from '../../layouts'
const Home: NextPage = () => {
  return (
    <Layout>
      <ProductCollectionTable />
    </Layout>
  )
}

export default Home
