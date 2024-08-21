import { Resend } from 'resend'
import config from '../config'
import { logger } from '../shared/logger'
import { AppError, ErrorCode } from '../shared/exceptions'

export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(config.resendApiKey)
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: config.fromEmail,
        to,
        subject,
        html,
      })
      logger.info(`Email sent successfully to ${to}`)
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error}`)
      throw new AppError(ErrorCode.EMAIL_SENDING_ERROR.code, 'Failed to send email', 500)
    }
  }

  async sendRegistrationJobSeekerEmail(email: string, otp: string): Promise<void> {
    const subject = 'Complete Your Registration'
    const html = `<p>Your OTP for registration is: ${otp}</p>`
    await this.sendEmail(email, subject, html)
  }

  async sendLoginJobSeekerEmail(email: string, otp: string): Promise<void> {
    const subject = 'Your Login OTP'
    const html = `<p>Your OTP for login is: ${otp}</p>`
    await this.sendEmail(email, subject, html)
  }

  async sendRegistrationEmployerEmail(email: string, otp: string): Promise<void> {
    const subject = 'Complete Your Registration'
    const html = `<p>Your OTP for registration is: ${otp}</p>`
    await this.sendEmail(email, subject, html)
  }

  async sendLoginEmployerEmail(email: string, otp: string): Promise<void> {
    const subject = 'Your Login OTP'
    const html = `<p>Your OTP for login is: ${otp}</p>`
    await this.sendEmail(email, subject, html)
  }
}