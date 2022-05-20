import { createRouter } from '../createRouter'
import z from 'zod'
import { env } from '../../env'

export const productRouter = createRouter()
  .query('findMany', {
    input: z.object({
      limit: z.number().optional(),
      pageToken: z.string().optional(),
      productSetName: z.string().optional(),
    }),

    async resolve({ ctx, input }) {
      if (input.productSetName == null) {
        const locationPath = ctx.visionClient.locationPath(
          env.PROJECT,
          env.LOCATION
        )
        const [productCollection, _, response] =
          await ctx.visionClient.listProducts(
            {
              parent: locationPath,
              pageSize: input?.limit ?? 10,
              pageToken: input?.pageToken,
            },
            {
              autoPaginate: false,
            }
          )
        return {
          nextPageToken: response.nextPageToken,
          productCollection: productCollection.map((product) => ({
            name: product.name,
            displayName: product.displayName,
          })),
        }
      } else {
        const productSetPath = ctx.visionClient.productSetPath(
          env.PROJECT,
          env.LOCATION,
          input.productSetName
        )
        const [productCollection, _, response] =
          await ctx.visionClient.listProductsInProductSet(
            {
              name: productSetPath,
            },
            {
              pageSize: 5,
              maxResults: 5,
              pageToken: input.pageToken,
            }
          )
        return {
          nextPageToken: response.nextPageToken,
          productCollection: productCollection.map((product) => ({
            name: product.name,
            displayName: product.displayName,
          })),
        }
      }
    },
  })
  .query('find', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const productPath = ctx.visionClient.productPath(
        env.PROJECT,
        env.LOCATION,
        input.id
      )
      const [product] = await ctx.visionClient.getProduct({
        name: productPath,
      })
      const [referenceImages] = await ctx.visionClient.listReferenceImages({
        parent: productPath,
      })
      return {
        name: product.name?.split('/').pop(),
        product,
        referenceImages,
      }
    },
  })
