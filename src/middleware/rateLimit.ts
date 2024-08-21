import { Context, Next } from 'hono'
import { AppError, ErrorCode } from '../shared/exceptions'

const RATE_LIMIT = 100 // requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

export const rateLimitMiddleware = () => {
  const ipRequests = new Map<string, number[]>()

  return async (c: Context, next: Next) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const now = Date.now()
    const requestTimestamps = ipRequests.get(ip) || []

    // Remove old timestamps
    const recentRequests = requestTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)

    if (recentRequests.length >= RATE_LIMIT) {
      throw new AppError(ErrorCode.RATE_LIMIT_EXCEEDED.code, 'Rate limit exceeded', 429)
    }

    recentRequests.push(now)
    ipRequests.set(ip, recentRequests)

    await next()
  }
}