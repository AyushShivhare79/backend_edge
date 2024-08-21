import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { VerifyOTP } from '../use_cases/verify_otp'
import { Container } from '../di/container'
import { handleErrors } from '../shared/utils'

const router = new Hono()

const schema = z.object({
  email: z.string().email(),
  otp: z.string()
})

router.post('/verify', zValidator('json', schema), async (c) => {
  try {
    const input = c.req.valid('json')
    const container = c.get('container') as Container
    const verifyOTP = new VerifyOTP(
      container.getDB(),
      container.getJobSeekerRepository(),
      container.getEmployerRepository(),
      container.getOTPService(),
      container.getTokenService()
    )
    const result = await verifyOTP.execute(input)
    return c.json(result)
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default router