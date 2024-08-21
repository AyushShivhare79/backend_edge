import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { id, email, refreshToken, createdAt, updatedAt } from './base'

export const jobSeekers = sqliteTable('job_seekers', {
  id,
  email,
  refreshToken,
  createdAt,
  updatedAt,
  // Add any JobSeeker-specific fields here
})

export type JobSeeker = typeof jobSeekers.$inferSelect
export type NewJobSeeker = typeof jobSeekers.$inferInsert