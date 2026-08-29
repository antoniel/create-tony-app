import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const repoRoot = path.resolve(packageRoot, '../..')

function resolveDatabaseUrl(url: string) {
  const value = url.replace(/^pglite:/, '')

  if (/^postgres(ql)?:\/\//.test(value)) {
    throw new Error(
      'DATABASE_URL is a Postgres URL. This starter still uses PGlite. Set DATABASE_URL to a data directory, e.g. packages/database/data',
    )
  }

  return path.isAbsolute(value) ? value : path.resolve(repoRoot, value)
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Set it in the workspace root .env')
}

export const dataDir = resolveDatabaseUrl(databaseUrl)
