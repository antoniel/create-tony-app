import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { envSchema } from './env'
import { healthRoute } from './modules/health'

export const app = new Elysia().env(envSchema).use(cors()).use(healthRoute)

export type App = typeof app
