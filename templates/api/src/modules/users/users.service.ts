import type { db as localDatabase } from "@app/database";
import type { createDatabase } from "@app/database/cloudflare";
import { users } from "@app/database/schema";
import type { CreateUser } from "./users.models";

export function createUsersService(db: typeof localDatabase | ReturnType<typeof createDatabase>) {
  return {
    async list() {
      return await db.select().from(users);
    },

    async create(input: CreateUser) {
      const [user] = await db.insert(users).values(input).returning();

      if (!user) {
        throw new Error("Could not create user");
      }

      return user;
    },
  };
}
