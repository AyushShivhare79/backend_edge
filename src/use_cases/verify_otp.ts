import { DB } from '../db'
import { OTPService } from '../services/otp_service'
import { TokenService } from '../services/token_service'
import { EmployerRepository } from '../repositories/employer_repository'
import { JobSeekerRepository } from '../repositories/job_seeker_repository'
import { VerifyOTPInput, VerifyOTPOutput } from '../schemas/verify_otp'
import { UserRole } from '../schemas/enums'
import { AppError, ErrorCode } from '../shared/exceptions'

export class VerifyOTP {
  constructor(
    private db: DB,
    private jobSeekerRepo: JobSeekerRepository,
    private employerRepo: EmployerRepository,
    private otpService: OTPService,
    private tokenService: TokenService
  ) {}

  async execute(input: VerifyOTPInput): Promise<VerifyOTPOutput> {
    return await this.db.transaction(async (tx) => {
      const otpData = await this.verifyOtp(input.email, input.otp)
      const [user, role] = await this.getOrCreateUser(input.email, otpData.role)
      const [accessToken, refreshToken] = this.generateTokens(user.id.toString(), role)
      await this.updateUser(user.id, role, refreshToken)
      await this.cleanup(input.email)

      return {
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        refresh_token: refreshToken,
        access_token: accessToken,
        role: role
      }
    })
  }

  private async verifyOtp(email: string, otp: string): Promise<{ hashedOtp: string; role: UserRole }> {
    const otpDataJson = await this.db.get('otp_data').get(`otp:${email}`)
    if (!otpDataJson) {
      throw new AppError(ErrorCode.OTP_VERIFICATION_ERROR.code, 'No active OTP found', 400)
    }

    const otpData = JSON.parse(otpDataJson)
    if (!this.otpService.verifyOtpHash(otp, otpData.hashedOtp)) {
      throw new AppError(ErrorCode.OTP_VERIFICATION_ERROR.code, 'Invalid OTP', 400)
    }

    return otpData
  }

  private async getOrCreateUser(email: string, role: UserRole): Promise<[any, UserRole]> {
    const repo = role === UserRole.JOB_SEEKER ? this.jobSeekerRepo : this.employerRepo
    let user = await repo.getByEmail(email)
    if (!user) {
      user = await repo.create({ email })
    }
    return [user, role]
  }

  private generateTokens(userId: string, role: UserRole): [string, string] {
    const accessToken = this.tokenService.generateAccessToken(userId, role)
    const refreshToken = this.tokenService.generateRefreshToken()
    return [accessToken, refreshToken]
  }

  private async updateUser(userId: number, role: UserRole, refreshToken: string): Promise<void> {
    const repo = role === UserRole.JOB_SEEKER ? this.jobSeekerRepo : this.employerRepo
    await repo.update(userId, { refreshToken })
  }

  private async cleanup(email: string): Promise<void> {
    await this.db.get('otp_data').delete(`otp:${email}`)
  }
}