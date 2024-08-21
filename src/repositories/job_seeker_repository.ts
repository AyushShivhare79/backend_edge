import { eq } from 'drizzle-orm'
import { DB } from '../db'
import { JobSeeker, NewJobSeeker, jobSeekers } from '../models'

export class JobSeekerRepository {
  constructor(private db: DB) {}

  async create(data: NewJobSeeker): Promise<JobSeeker> {
    const [jobSeeker] = await this.db.insert(jobSeekers).values(data).returning()
    return jobSeeker
  }

  async getByEmail(email: string): Promise<JobSeeker | undefined> {
    const [jobSeeker] = await this.db.select().from(jobSeekers).where(eq(jobSeekers.email, email)).limit(1)
    return jobSeeker
  }

  async getById(id: number): Promise<JobSeeker | undefined> {
    const [jobSeeker] = await this.db.select().from(jobSeekers).where(eq(jobSeekers.id, id)).limit(1)
    return jobSeeker
  }

  async update(id: number, data: Partial<NewJobSeeker>): Promise<JobSeeker | undefined> {
    const [updatedJobSeeker] = await this.db
      .update(jobSeekers)
      .set(data)
      .where(eq(jobSeekers.id, id))
      .returning()
    return updatedJobSeeker
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [result] = await this.db
      .select({ count: sql`count(*)` })
      .from(jobSeekers)
      .where(eq(jobSeekers.email, email))
    return result.count > 0
  }
}