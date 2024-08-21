import { DB } from '../db'
import { schema } from '../models'
import { AppError, ErrorCode } from '../shared/exceptions'

export class DatabaseManagement {
  constructor(private db: DB) {}

  async execute(action: 'CREATE' | 'DROP'): Promise<string> {
    try {
      if (action === 'CREATE') {
        return await this.createTables()
      } else if (action === 'DROP') {
        return await this.dropTables()
      } else {
        throw new AppError(ErrorCode.INVALID_INPUT.code, "Invalid action. Use 'CREATE' or 'DROP'.", 400)
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ErrorCode.DATABASE_ERROR.code, `Failed to ${action.toLowerCase()} database tables: ${error}`, 500)
    }
  }

  private async createTables(): Promise<string> {
    // Note: This is a simplified version. In practice, you'd use Drizzle's migration system.
    await this.db.run(schema)
    return "Database tables created successfully"
  }

  private async dropTables(): Promise<string> {
    // Note: This is a simplified version. In practice, you'd use Drizzle's migration system.
    for (const table of Object.values(schema)) {
      await this.db.drop(table)
    }
    return "Database tables dropped successfully"
  }
}