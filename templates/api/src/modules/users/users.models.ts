import { t } from 'elysia'

export const userModel = t.Object({
  id: t.String({ format: 'uuid' }),
  name: t.String(),
  email: t.String({ format: 'email' }),
  createdAt: t.Date(),
})

export const createUserModel = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: 'email' }),
})

export type CreateUser = typeof createUserModel.static
