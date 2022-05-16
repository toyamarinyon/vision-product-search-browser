import { createReactQueryHooks } from '@trpc/react'
import type { AppRouter } from '../server/routes/_app'

export const trpc = createReactQueryHooks<AppRouter>()
