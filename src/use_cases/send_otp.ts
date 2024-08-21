import { DB } from '../db'
import { OTPService } from '../services/otp_service'
import { EmailService } from '../services/email_service'
import { EmployerRepository } from '../repositories/employer_repository'
import { JobSeekerRepository } from '../repositories/job_seeker_repository'
import { SendOTPInput } from '../schemas/send_otp'
import { UserRole } from '../schemas/enums'
import { AppError, ErrorCode } from '../shared/exceptions'
import { isValidEmail } from '../shared/utils'

export class SendOTP {
  constructor(
    private db: DB,
    private jobSeekerRepo: JobSeekerRepository,
    private employerRepo: EmployerRepository,
    private otpService: OTPService,
    private emailService: EmailService
  ) {}

  async execute(input: SendOTPInput): Promise<string> {
    if (!isValidEmail(input.email)) {
      throw new AppError(ErrorCode.INVALID_INPUT.code, 'Invalid email format', 400)
    }

    const existingRole = await this.checkExistingUser(input.email)
    const [isRegistration, role] = this.determineAction(existingRole, input.role)

    const [otp, hashedOtp] = this.otpService.generateAndHashOtp()
    await this.storeOtp(input.email, hashedOtp, role)
    await this.sendEmail(input.email, role, isRegistration, otp)

    return this.generateResponseMessage(role, isRegistration)
  }

  private async checkExistingUser(email: string): Promise<UserRole | null> {
    const jobSeeker = await this.jobSeekerRepo.getByEmail(email)
    if (jobSeeker) return UserRole.JOB_SEEKER

    const employer = await this.employerRepo.getByEmail(email)
    if (employer) return UserRole.EMPLOYER

    return null
  }

  private determineAction(existingRole: UserRole | null, requestedRole?: UserRole): [boolean, UserRole] {
    if (existingRole) return [false, existingRole]
    if (requestedRole) return [true, requestedRole]
    throw new AppError(ErrorCode.INVALID_ROLE.code, 'Please provide a role (JOB_SEEKER or EMPLOYER) for user registration', 400)
  }

  private async storeOtp(email: string, hashedOtp: string, role: UserRole): Promise<void> {
    const otpData = JSON.stringify({ hashedOtp, role })
    await this.db.get('otp_data').put(`otp:${email}`, otpData, { expirationTtl: 900 }) // 15 minutes
  }

  private async sendEmail(email: string, role: UserRole, isRegistration: boolean, otp: string): Promise<void> {
    const emailType = isRegistration ? 'registration' : 'login'
    const method = `send${emailType.charAt(0).toUpperCase() + emailType.slice(1)}${role}Email` as keyof EmailService
    await this.emailService[method](email, otp)
  }

  private generateResponseMessage(role: UserRole, isRegistration: boolean): string {
    const action = isRegistration ? 'complete registration' : 'log in'
    return `Hi ${role.toLowerCase().replace('_', ' ')}, please enter the OTP sent to your email to ${action}`
  }
}