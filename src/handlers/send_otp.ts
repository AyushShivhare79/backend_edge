import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { SendOTP } from '../use_cases/send_otp'
import { Container } from '../di/container'
import { handleErrors } from '../shared/utils'
import { UserRole } from '../schemas/enums'

const router = new Hono()

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional()
})

router.post('/send', zValidator('json', schema), async (c) => {
  try {
    const input = c.req.valid('json')
    const container = c.get('container') as Container
    const sendOTP = new SendOTP(
      container.getDB(),
      container.getJobSeekerRepository(),
      container.getEmployerRepository(),
      container.getOTPService(),
      container.getEmailService()
    )
    const result = await sendOTP.execute(input)
    return c.json({ message: result })
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default router