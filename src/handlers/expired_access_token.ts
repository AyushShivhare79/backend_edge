import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ExpiredAccessToken } from '../use_cases/expired_access_token'
import { Container } from '../di/container'
import { handleErrors } from '../shared/utils'

const router = new Hono()

const schema = z.object({
  refresh_token: z.string(),
  expired_access_token: z.string()
})

router.post('/refresh-expired-access-token', zValidator('json', schema), async (c) => {
  try {
    const input = c.req.valid('json')
    const container = c.get('container') as Container
    const expiredAccessToken = new ExpiredAccessToken(
      container.getDB(),
      container.getTokenService(),
      container.getEmployerRepository(),
      container.getJobSeekerRepository()
    )
    const result = await expiredAccessToken.execute(input)
    return c.json(result)
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default router