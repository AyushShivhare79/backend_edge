import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { GetUserProfile } from '../use_cases/profile'
import { Container } from '../di/container'
import { handleErrors } from '../shared/utils'
import { UserRole } from '../schemas/enums'

const router = new Hono()

const schema = z.object({
  user_id: z.number(),
  role: z.nativeEnum(UserRole)
})

router.post('/user-profile', zValidator('json', schema), async (c) => {
  try {
    const input = c.req.valid('json')
    const container = c.get('container') as Container
    const getUserProfile = new GetUserProfile(
      container.getDB(),
      container.getJobSeekerRepository(),
      container.getEmployerRepository()
    )
    const user = await getUserProfile.execute(input)
    return c.json({
      user_id: user.id,
      role: input.role,
      message: `Profile for user ${user.id}`,
      user
    })
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default router