import { createRouter } from '../createRouter'
import z from 'zod'
import { env } from '../../env'

export const productRouter = createRouter()
  .query('findMany', {
    async resolve({ ctx }) {
      const locationPath = ctx.visionClient.locationPath(
        env.PROJECT,
        env.LOCATION
      )
      const [productCollection] = await ctx.visionClient.listProducts({
        parent: locationPath,
      })
      return {
        productCollection,
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
        product,
        referenceImages,
      }
    },
  })
