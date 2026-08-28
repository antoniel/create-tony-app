import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { healthRoute } from './modules/health'

export const app = new Elysia().use(cors()).use(healthRoute)

export type App = typeof app
