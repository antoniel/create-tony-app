import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const dataDir = process.env.PGLITE_DATA_DIR ?? path.join(packageRoot, 'data')
