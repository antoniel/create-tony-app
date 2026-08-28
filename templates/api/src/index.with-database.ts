import { db, users } from '@app/database'
import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(cors())
  .get('/', () => ({ name: 'Tony API' }))
  .get('/health', () => ({ status: 'ok' }))
  .get('/users', () => db.select().from(users))
  .listen(Number(process.env.PORT ?? 3001))

console.log(`API running at ${app.server?.url}`)
