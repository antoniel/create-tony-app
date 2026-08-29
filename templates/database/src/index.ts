import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/pglite'
import { dataDir } from './data-dir'
import * as schema from './schema'

export const db = drizzle(dataDir, { schema })

await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
  )
`)

export * from './schema'
