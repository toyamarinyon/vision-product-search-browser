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

      return {
        productSet,
      }
    },
  })
