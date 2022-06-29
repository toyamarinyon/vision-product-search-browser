import { useRef, useState } from 'react'
import { Td, Th } from '../layouts/table'
import { InferMutationOutput } from '../utils/trpc'
import { Tab } from '@headlessui/react'
import classNames from 'classnames'

const vertexColors = ['#2196F3', '#4CAF50', '#FFEB3B', '#FF5722', '#9C27B0']

export function SearchResult({
  data,
  searchImageEncodedBase64,
}: {
  data: InferMutationOutput<'productSet.annotate'> | undefined
  searchImageEncodedBase64: string | undefined
}) {
  const [imageHeight, setImageHeight] = useState(0)
  const ref = useRef<HTMLImageElement>(null)

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
    <div className="flex space-x-2">
      <div className="relative w-1/2 h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full"
          src={searchImageEncodedBase64}
          alt=""
          ref={ref}
          onLoad={() => {
            if (ref != null && ref.current != null) {
              setImageHeight(ref.current.getBoundingClientRect().height)
            }
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            height: imageHeight,
          }}
        >
          {data.productSearchResults.productGroupedResults?.map(
            (productGroupedResult, i) => (
              <svg
                height="100%"
                width="100%"
                key={`svg-${i}`}
                viewBox="0 0 100 100"
                className="absolute"
              >
                <polygon
                  fill="none"
                  stroke={vertexColors[i % vertexColors.length]}
                  points={productGroupedResult.boundingPoly?.normalizedVertices
                    ?.map(
                      (vertex) =>
                        `${(vertex.x ?? 0) * 100}, ${(vertex.y ?? 0) * 100}`
                    )
                    .join(' ')}
                />
                <rect
                  x={
                    (productGroupedResult.boundingPoly?.normalizedVertices?.[0]
                      .x ?? 0) * 100
                  }
                  y={
                    (productGroupedResult.boundingPoly?.normalizedVertices?.[0]
                      .y ?? 0) * 100
                  }
                  width="4"
                  height="4"
                  fill={vertexColors[i % vertexColors.length]}
                />
                <text
                  x={
                    (productGroupedResult.boundingPoly?.normalizedVertices?.[0]
                      .x ?? 0) *
                      100 +
                    0.5
                  }
                  y={
                    (productGroupedResult.boundingPoly?.normalizedVertices?.[0]
                      .y ?? 0) *
                      100 +
                    3
                  }
                  style={{
                    fontSize: '3px',
                  }}
                  fill="white"
                >
                  {i}
                </text>
              </svg>
            )
          )}
        </div>
      </div>
      <section className="text-gray-500">
        <Tab.Group>
          <Tab.List className="border-b border-gray-200 space-x-4 mb-5 px-4">
            <Tab
              className={({ selected }) =>
                classNames(
                  'font-medium leading-5 py-4 px-2',
                  'ring-white ring-offset-blue-400 focus:outline-none',
                  selected
                    ? 'border-b-2 border-blue-700  text-blue-700'
                    : 'text-gray-500 hover:text-black'
                )
              }
            >
              Entire image
            </Tab>
            {data.productSearchResults.productGroupedResults?.map((_, i) => (
              <Tab
                key={`tab-${i}`}
                className={({ selected }) =>
                  classNames(
                    'font-medium leading-5 py-4 px-2',
                    'ring-white ring-offset-blue-400 focus:outline-none',
                    selected
                      ? 'border-b-2 border-blue-700  text-blue-700'
                      : 'text-gray-500 hover:text-black'
                  )
                }
              >
                Group {i}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
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
            </Tab.Panel>
            {data.productSearchResults.productGroupedResults?.map(
              (groupedResult, i) => (
                <Tab.Panel key={`tab-content-${i}`}>
                  <table>
                    <thead>
                      <tr>
                        <Th>Name</Th>
                        <Th>Display Name</Th>
                        <Th>Score</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedResult?.results?.map((result) => (
                        <tr
                          key={`grouped-search-result-list-${result.product?.name}`}
                        >
                          <Td>{result.product?.name?.split('/').pop()}</Td>
                          <Td>{result.product?.displayName}</Td>
                          <Td>{result.score}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Tab.Panel>
              )
            )}
          </Tab.Panels>
        </Tab.Group>
      </section>
    </div>
  )
}
