import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const repoRoot = path.resolve(packageRoot, '../..')

function readDatabaseUrlFromEnvFile() {
  const envFile = path.join(repoRoot, '.env')
  if (!fs.existsSync(envFile)) {
    return undefined
  }

  const match = fs.readFileSync(envFile, 'utf8').match(/^DATABASE_URL=(.+)$/m)
  return match?.[1]?.trim()
}

function resolveDatabaseUrl(url: string) {
  const value = url.replace(/^file:/, '')

  if (/^postgres(ql)?:\/\//.test(value) || /^pglite:/i.test(url)) {
    throw new Error(
      'DATABASE_URL is not a SQLite path. Set it to a database file, e.g. packages/database/data.db',
    )
  }

  return path.isAbsolute(value) ? value : path.resolve(repoRoot, value)
}

const databaseUrl = process.env.DATABASE_URL || readDatabaseUrlFromEnvFile()

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Set it in the workspace root .env')
}

export const databasePath = resolveDatabaseUrl(databaseUrl)
