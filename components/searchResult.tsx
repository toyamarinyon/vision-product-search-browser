import { Td, Th } from '../layouts/table'
import { InferMutationOutput } from '../utils/trpc'

export function SearchResult({
  data,
}: {
  data: InferMutationOutput<'productSet.annotate'> | undefined
}) {
  if (data == null) {
    return (
      <div className="text-red-500">
        <p>No results</p>
      </div>
    )
  }
  if (data.error) {
    return (
      <div className="text-red-500">
        <p>{data.error.message}</p>
      </div>
    )
  }
  if (
    data.productSearchResults?.results == null ||
    data.productSearchResults?.results.length === 0
  ) {
    return (
      <div className="text-red-500">
        <p>No results</p>
      </div>
    )
  }
  return (
    <table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Display Name</Th>
          <Th>Score</Th>
        </tr>
      </thead>
      <tbody>
        {data.productSearchResults.results.map((result) => (
          <tr key={`search-result-list-${result.product?.name}`}>
            <Td>{result.product?.name?.split('/').pop()}</Td>
            <Td>{result.product?.displayName}</Td>
            <Td>{result.score}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
