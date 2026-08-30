import { Database } from 'bun:sqlite'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { databasePath } from './database-path'
import * as schema from './schema'

mkdirSync(path.dirname(databasePath), { recursive: true })

const sqlite = new Database(databasePath, { create: true })
sqlite.exec('PRAGMA journal_mode = WAL')
sqlite.exec('PRAGMA foreign_keys = ON')

export const db = drizzle({ client: sqlite, schema })

db.run(sql`
  CREATE TABLE IF NOT EXISTS "users" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "created_at" integer DEFAULT (unixepoch()) NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email")
  )
`)

export * from './schema'
