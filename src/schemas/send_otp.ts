import { z } from 'zod'
import { UserRole } from './enums'

export const SendOTPInputSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional()
})

export const SendOTPOutputSchema = z.object({
  message: z.string()
})

export type SendOTPInput = z.infer<typeof SendOTPInputSchema>
export type SendOTPOutput = z.infer<typeof SendOTPOutputSchema>