import { drizzle } from 'drizzle-orm/d1'
import { schema } from '../models'

export function initDB(dbBinding: D1Database) {
  return drizzle(dbBinding, { schema })
}

export type DB = ReturnType<typeof initDB>