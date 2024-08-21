import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { DatabaseManagement } from '../use_cases/database_admin'
import { Container } from '../di/container'
import { handleErrors } from '../shared/utils'

const router = new Hono()

const schema = z.object({
  action: z.enum(['CREATE', 'DROP'])
})

router.post('/', zValidator('json', schema), async (c) => {
  try {
    const { action } = c.req.valid('json')
    const container = c.get('container') as Container
    const db = container.getDB()
    const databaseManagement = new DatabaseManagement(db)
    const result = await databaseManagement.execute(action)
    return c.json({ message: result })
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default router