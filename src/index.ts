import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { Container } from './di/container'
import { initDB } from './db'
import { authMiddleware } from './middleware/auth'
import { rateLimitMiddleware } from './middleware/rateLimit'
import { logger } from './shared/logger'
import databaseAdminRoutes from './handlers/database_admin'
import expiredAccessTokenRoutes from './handlers/expired_access_token'
import profileRoutes from './handlers/profile'
import sendOtpRoutes from './handlers/send_otp'
import verifyOtpRoutes from './handlers/verify_otp'
import { handleErrors } from './shared/utils'

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID())
  logger.info(`Request received: ${c.req.method} ${c.req.url}`, c)
  await next()
  logger.info(`Response sent: ${c.res.status}`, c)
})
app.use('*', cors())
app.use('*', prettyJSON())
app.use('*', secureHeaders())
app.use('*', rateLimitMiddleware())

app.onError((err, c) => {
  logger.error('An error occurred', err, c)
  return handleErrors(c, err)
})

// Initialize container
app.use('*', async (c, next) => {
  const db = initDB(c.env.DB)
  const container = Container.getInstance(db)
  c.set('container', container)
  await next()
})

// Routes
app.route('/admin', databaseAdminRoutes)
app.route('/token', expiredAccessTokenRoutes)
app.route('/profile', authMiddleware(Container.getInstance(initDB(app.env.DB)).getTokenService()), profileRoutes)
app.route('/otp', sendOtpRoutes)
app.route('/otp', verifyOtpRoutes)

export default app