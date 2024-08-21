import { z } from 'zod'

export const ExpiredAccessTokenInputSchema = z.object({
  refresh_token: z.string(),
  expired_access_token: z.string()
})

export const ExpiredAccessTokenOutputSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional()
})

export type ExpiredAccessTokenInput = z.infer<typeof ExpiredAccessTokenInputSchema>
export type ExpiredAccessTokenOutput = z.infer<typeof ExpiredAccessTokenOutputSchema>