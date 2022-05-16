import superjson from 'superjson'
import { createRouter } from '../createRouter'
import { productRouter } from './product'
import { productSetRouter } from './productSet'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('productSet.', productSetRouter)
  .merge('product.', productRouter)

export type AppRouter = typeof appRouter
