import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import vision from '@google-cloud/vision'

const visionClient = new vision.ProductSearchClient()
const imageAnnotatorClient = new vision.ImageAnnotatorClient()
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  return {
    req,
    res,
    visionClient,
    imageAnnotatorClient,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
