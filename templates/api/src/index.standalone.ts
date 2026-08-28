import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(cors())
  .get('/', () => ({ name: 'Tony API' }))
  .get('/health', () => ({ status: 'ok' }))
  .listen(Number(process.env.PORT ?? 3001))

console.log(`API running at ${app.server?.url}`)
