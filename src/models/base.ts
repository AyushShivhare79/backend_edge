import { sql } from 'drizzle-orm'
import { integer, text, timestamp } from 'drizzle-orm/d1'

export const id = integer('id').primaryKey({ autoIncrement: true })
export const email = text('email').notNull().unique()
export const refreshToken = text('refresh_token')
export const createdAt = timestamp('created_at').default(sql`CURRENT_TIMESTAMP`)
export const updatedAt = timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`)