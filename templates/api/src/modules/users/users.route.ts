import { Elysia, t } from 'elysia'
import { createUserModel, userModel } from './users.models'
import { usersService } from './users.service'

export const usersRoute = new Elysia({ prefix: '/users' })
  .get('/', () => usersService.list(), {
    response: t.Array(userModel),
  })
  .post('/', ({ body }) => usersService.create(body), {
    body: createUserModel,
    response: userModel,
  })
