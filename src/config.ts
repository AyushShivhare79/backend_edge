import { z } from 'zod'

const envSchema = z.object({
  RESEND_API_KEY: z.string(),
  FROM_EMAIL: z.string().email(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  ENVIRONMENT: z.enum(['development', 'production']).default('development'),
})

declare global {
  interface Env {
    DB: D1Database
    OTP_STORE: KVNamespace
  }
}

export const config = {
  ...envSchema.parse(process.env),
  isProd: process.env.ENVIRONMENT === 'production',
}