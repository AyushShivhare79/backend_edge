import { OTPService } from '../services/otp_service'
import { EmailService } from '../services/email_service'
import { TokenService } from '../services/token_service'
import { EmployerRepository } from '../repositories/employer_repository'
import { JobSeekerRepository } from '../repositories/job_seeker_repository'
import { DB } from '../db'

export class Container {
  private static instance: Container

  private constructor(private db: DB) {}

  static getInstance(db: DB): Container {
    if (!Container.instance) {
      Container.instance = new Container(db)
    }
    return Container.instance
  }

  getOTPService(): OTPService {
    return new OTPService()
  }

  getEmailService(): EmailService {
    return new EmailService()
  }

  getTokenService(): TokenService {
    return new TokenService()
  }

  getEmployerRepository(): EmployerRepository {
    return new EmployerRepository(this.db)
  }

  getJobSeekerRepository(): JobSeekerRepository {
    return new JobSeekerRepository(this.db)
  }
}