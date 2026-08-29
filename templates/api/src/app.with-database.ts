import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { envSchema } from './env'
import { healthRoute } from './modules/health'
import { usersRoute } from './modules/users'

export const app = new Elysia().env(envSchema).use(cors()).use(healthRoute).use(usersRoute)

export type App = typeof app
