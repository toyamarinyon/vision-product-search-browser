import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'

const ShowProductPage: NextPage = () => {
  const router = useRouter()
  const query = trpc.useQuery([
    'product.find',
    { id: router.query.id as string },
  ])
  if (query.isLoading) {
    return <div>loading</div>
  }

  return (
    <main>
      <ul className="block space-y-4">
        {query.data?.referenceImages?.map((referenceImage) => (
          <li key={referenceImage.name}>
            <p>path: {referenceImage.name}</p>
            <p>uri: {referenceImage.uri}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default ShowProductPage
