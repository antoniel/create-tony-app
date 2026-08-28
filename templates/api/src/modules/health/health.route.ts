import { Elysia } from 'elysia'
import { healthModel } from './health.models'
import { healthService } from './health.service'

export const healthRoute = new Elysia({ prefix: '/health' }).get(
  '/',
  () => healthService.check(),
  { response: healthModel },
)
