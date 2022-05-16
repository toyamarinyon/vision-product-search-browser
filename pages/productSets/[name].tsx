import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const ShowProductSetPage: NextPage = () => {
  const router = useRouter()
  const query = trpc.useQuery([
    'productSet.find',
    { productSetName: router.query.name as string },
  ])
  if (query.isLoading) {
    return <div>loading</div>
  }

  return (
    <main>
      {query.data?.productCollection?.map((product) => (
        <div key={product.name}>{product.name}</div>
      ))}
    </main>
  )
}

export default ShowProductSetPage
