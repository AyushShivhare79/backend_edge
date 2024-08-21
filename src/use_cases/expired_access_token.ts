import { DB } from '../db'
import { TokenService } from '../services/token_service'
import { EmployerRepository } from '../repositories/employer_repository'
import { JobSeekerRepository } from '../repositories/job_seeker_repository'
import { ExpiredAccessTokenInput, ExpiredAccessTokenOutput } from '../schemas/expired_access_token'
import { UserRole } from '../schemas/enums'
import { AppError, ErrorCode } from '../shared/exceptions'

export class ExpiredAccessToken {
  constructor(
    private db: DB,
    private tokenService: TokenService,
    private employerRepo: EmployerRepository,
    private jobSeekerRepo: JobSeekerRepository
  ) {}

  async execute(input: ExpiredAccessTokenInput): Promise<ExpiredAccessTokenOutput> {
    return await this.db.transaction(async (tx) => {
      const accessTokenPayload = this.tokenService.verifyAccessToken(input.expired_access_token)
      const refreshTokenPayload = this.tokenService.verifyRefreshToken(input.refresh_token)

      if (!this.tokenService.isAccessTokenExpired(accessTokenPayload)) {
        throw new AppError(ErrorCode.TOKEN_NOT_EXPIRED.code, 'Access token has not expired yet', 400)
      }

      const { user, role } = await this.getUserAndRole(accessTokenPayload.sub, accessTokenPayload.role as UserRole)

      if (user.refreshToken !== input.refresh_token) {
        throw new AppError(ErrorCode.INVALID_REFRESH_TOKEN.code, 'Invalid refresh token', 401)
      }

      const newAccessToken = this.tokenService.generateAccessToken(user.id.toString(), role)
      let newRefreshToken = input.refresh_token

      if (this.tokenService.isRefreshTokenNearExpiry(refreshTokenPayload)) {
        newRefreshToken = this.tokenService.generateRefreshToken()
        await this.updateUserRefreshToken(user.id, newRefreshToken, role)
      }

      return { access_token: newAccessToken, refresh_token: newRefreshToken }
    })
  }

  private async getUserAndRole(userId: string, role: UserRole): Promise<{ user: any; role: UserRole }> {
    const repo = role === UserRole.JOB_SEEKER ? this.jobSeekerRepo : this.employerRepo
    const user = await repo.getById(parseInt(userId))
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND.code, 'User not found', 404)
    return { user, role }
  }

  private async updateUserRefreshToken(userId: number, newRefreshToken: string, role: UserRole): Promise<void> {
    const repo = role === UserRole.JOB_SEEKER ? this.jobSeekerRepo : this.employerRepo
    await repo.update(userId, { refreshToken: newRefreshToken })
  }
}