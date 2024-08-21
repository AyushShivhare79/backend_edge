import { sign, verify } from 'jsonwebtoken'
import config from '../config'
import { UserRole } from '../schemas/enums'
import { AppError, ErrorCode } from '../shared/exceptions'

interface AccessTokenPayload {
  sub: string
  exp: number
  role: UserRole
}

interface RefreshTokenPayload {
  exp: number
}

export class TokenService {
  generateAccessToken(userId: string, role: UserRole): string {
    const payload: AccessTokenPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      role,
    }
    return sign(payload, config.jwtSecret)
  }

  generateRefreshToken(): string {
    const payload: RefreshTokenPayload = {
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    }
    return sign(payload, config.jwtSecret)
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return verify(token, config.jwtSecret) as AccessTokenPayload
    } catch (error) {
      throw new AppError(ErrorCode.TOKEN_VALIDATION_ERROR.code, 'Invalid token', 401)
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return verify(token, config.jwtSecret) as RefreshTokenPayload
    } catch (error) {
      throw new AppError(ErrorCode.TOKEN_VALIDATION_ERROR.code, 'Invalid refresh token', 401)
    }
  }

  isAccessTokenExpired(token: AccessTokenPayload): boolean {
    return Date.now() >= token.exp * 1000
  }

  isRefreshTokenNearExpiry(token: RefreshTokenPayload, days: number = 7): boolean {
    return (token.exp * 1000 - Date.now()) < days * 24 * 60 * 60 * 1000
  }
}