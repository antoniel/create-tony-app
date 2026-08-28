import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { healthRoute } from './modules/health'
import { usersRoute } from './modules/users'

export const app = new Elysia().use(cors()).use(healthRoute).use(usersRoute)

export type App = typeof app
