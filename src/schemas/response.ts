import { z } from 'zod'

export const StatusSchema = z.object({
  success: z.boolean(),
  code: z.number(),
  message: z.string(),
  error_code: z.string().optional()
})

export const APIResponseSchema = z.object({
  status: StatusSchema,
  data: z.unknown().optional()
})

export type Status = z.infer<typeof StatusSchema>
export type APIResponse<T> = z.infer<typeof APIResponseSchema> & { data?: T }