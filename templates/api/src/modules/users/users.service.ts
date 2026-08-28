import { db, users } from '@app/database'
import type { CreateUser } from './users.models'

export const usersService = {
  list() {
    return db.select().from(users)
  },

  async create(input: CreateUser) {
    const [user] = await db.insert(users).values(input).returning()

    if (!user) {
      throw new Error('Could not create user')
    }

    return user
  },
}
