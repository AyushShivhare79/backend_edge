import { z } from 'zod'

export const VerifyOTPInputSchema = z.object({
  email: z.string().email(),
  otp: z.string()
})

export const VerifyOTPOutputSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  created_at: z.date(),
  updated_at: z.date(),
  refresh_token: z.string().optional(),
  access_token: z.string(),
  role: z.string()
})

export type VerifyOTPInput = z.infer<typeof VerifyOTPInputSchema>
export type VerifyOTPOutput = z.infer<typeof VerifyOTPOutputSchema>