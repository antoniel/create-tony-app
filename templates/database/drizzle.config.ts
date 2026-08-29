import { defineConfig } from 'drizzle-kit'
import { dataDir } from './src/data-dir'

export default defineConfig({
  dialect: 'postgresql',
  driver: 'pglite',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: dataDir,
  },
})
