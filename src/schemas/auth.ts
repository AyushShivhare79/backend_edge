import { z } from 'zod'
import { UserRole } from './enums'

export const AuthUserInputSchema = z.object({
  user_id: z.number(),
  role: z.nativeEnum(UserRole)
})

export type AuthUserInput = z.infer<typeof AuthUserInputSchema>