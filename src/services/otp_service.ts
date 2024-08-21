import { createHash, randomBytes } from 'crypto'

export class OTPService {
  generateAndHashOtp(): [string, string] {
    const otp = this.generateOtp()
    const hashedOtp = this.hashOtp(otp)
    return [otp, hashedOtp]
  }

  verifyOtpHash(receivedOtp: string, hashedOtp: string): boolean {
    return this.hashOtp(receivedOtp) === hashedOtp
  }

  private generateOtp(): string {
    return randomBytes(2).readUInt16BE(0).toString().padStart(4, '0')
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex')
  }
}