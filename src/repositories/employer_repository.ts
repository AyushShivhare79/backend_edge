import { eq } from 'drizzle-orm'
import { DB } from '../db'
import { Employer, NewEmployer, employers } from '../models'

export class EmployerRepository {
  constructor(private db: DB) {}

  async create(data: NewEmployer): Promise<Employer> {
    const [employer] = await this.db.insert(employers).values(data).returning()
    return employer
  }

  async getByEmail(email: string): Promise<Employer | undefined> {
    const [employer] = await this.db.select().from(employers).where(eq(employers.email, email)).limit(1)
    return employer
  }

  async getById(id: number): Promise<Employer | undefined> {
    const [employer] = await this.db.select().from(employers).where(eq(employers.id, id)).limit(1)
    return employer
  }

  async update(id: number, data: Partial<NewEmployer>): Promise<Employer | undefined> {
    const [updatedEmployer] = await this.db
      .update(employers)
      .set(data)
      .where(eq(employers.id, id))
      .returning()
    return updatedEmployer
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [result] = await this.db
      .select({ count: sql`count(*)` })
      .from(employers)
      .where(eq(employers.email, email))
    return result.count > 0
  }
}