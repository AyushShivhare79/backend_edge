import { TokenService } from './token_service'
import { AppError, ErrorCode } from '../shared/exceptions'
import { UserRole } from '../schemas/enums'

export class AuthService {
  constructor(private tokenService: TokenService) {}

  authenticateToken(token: string): any {
    try {
      const tokenPayload = this.tokenService.verifyAccessToken(token)
      if (this.tokenService.isAccessTokenExpired(tokenPayload)) {
        throw ErrorCode.TOKEN_EXPIRED
      }
      return tokenPayload
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw ErrorCode.INVALID_TOKEN
    }
  }

  validateUserInput(userInput: { user_id: number; role: UserRole }, tokenPayload: any): boolean {
    return (
      userInput.user_id.toString() === tokenPayload.sub &&
      userInput.role === tokenPayload.role
    )
  }

  checkRolePermission(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole)
  }
}