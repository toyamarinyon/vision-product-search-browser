import { createRouter } from '../createRouter'
import { z } from 'zod'
import { env } from '../../env'

export const productSetRouter = createRouter()
  .query('findMany', {
    async resolve({ ctx }) {
      const parent = ctx.visionClient.locationPath(env.PROJECT, env.LOCATION)
      const [productSetCollection] = await ctx.visionClient.listProductSets({
        parent,
      })
      return {
        productSetCollection,
      }
    },
  })
  .query('find', {
    input: z.object({
      productSetName: z.string(),
      pageToken: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const productSetPath = ctx.visionClient.productSetPath(
        env.PROJECT,
        env.LOCATION,
        input.productSetName
      )
      const [productSet] = await ctx.visionClient.getProductSet({
        name: productSetPath,
      })
      console.log(JSON.stringify(productSet, null, 2))

      return {
        productSet,
      }
    },
  })
  .mutation('annotate', {
    input: z.object({
      productSetName: z.string(),
      fileEncodedBase64: z.string(),
    }),
    async resolve({ ctx, input }) {
      const productSet = ctx.visionClient.productSetPath(
        env.PROJECT,
        env.LOCATION,
        input.productSetName
      )
      const request = {
        image: {
          content: input.fileEncodedBase64,
        },
        features: [{ type: 'PRODUCT_SEARCH' }],
        imageContext: {
          productSearchParams: {
            productSet,
            productCategories: ['general-v1'],
          },
        },
      }
      const [response] = await ctx.imageAnnotatorClient.annotateImage(request)
      return response
    },
  })
