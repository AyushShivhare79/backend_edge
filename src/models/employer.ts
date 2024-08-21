import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { id, email, refreshToken, createdAt, updatedAt } from './base'

export const employers = sqliteTable('employers', {
  id,
  email,
  refreshToken,
  createdAt,
  updatedAt,
  // Add any Employer-specific fields here
})

export type Employer = typeof employers.$inferSelect
export type NewEmployer = typeof employers.$inferInsert