import { Context, Next } from 'hono'
import { TokenService } from '../services/token_service'
import { AppError, ErrorCode } from '../shared/exceptions'

export const authMiddleware = (tokenService: TokenService) => {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.UNAUTHORIZED.code, 'Missing or invalid Authorization header', 401)
    }

    const token = authHeader.split(' ')[1]
    try {
      const payload = tokenService.verifyAccessToken(token)
      c.set('user', payload)
      await next()
    } catch (error) {
      throw new AppError(ErrorCode.INVALID_TOKEN.code, 'Invalid token', 401)
    }
  }
}