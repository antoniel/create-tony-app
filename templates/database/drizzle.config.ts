import { defineConfig } from 'drizzle-kit'
import { databasePath } from './src/database-path'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: databasePath,
  },
})
