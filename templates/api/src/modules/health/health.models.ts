import { t } from 'elysia'

export const healthModel = t.Object({
  status: t.Literal('ok'),
})
