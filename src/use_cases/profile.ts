import { DB } from '../db'
import { EmployerRepository } from '../repositories/employer_repository'
import { JobSeekerRepository } from '../repositories/job_seeker_repository'
import { AuthUserInput } from '../schemas/auth'
import { UserRole } from '../schemas/enums'
import { AppError, ErrorCode } from '../shared/exceptions'

export class GetUserProfile {
  constructor(
    private db: DB,
    private jobSeekerRepo: JobSeekerRepository,
    private employerRepo: EmployerRepository
  ) {}

  async execute(input: AuthUserInput): Promise<any> {
    const repo = this.getRepository(input.role)
    const user = await repo.getById(input.user_id)

    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND.code, 'User not found', 404)
    }

    if ((input.role === UserRole.JOB_SEEKER && 'company' in user) ||
        (input.role === UserRole.EMPLOYER && !('company' in user))) {
      throw new AppError(ErrorCode.UNAUTHORIZED.code, 'User role mismatch', 401)
    }

    return user
  }

  private getRepository(role: UserRole) {
    return role === UserRole.JOB_SEEKER ? this.jobSeekerRepo : this.employerRepo
  }
}