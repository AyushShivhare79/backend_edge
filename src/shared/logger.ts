import { Context } from 'hono'

export const logger = {
  info: (message: string, context?: Context) => {
    console.log(JSON.stringify({
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      requestId: context?.get('requestId'),
    }))
  },
  error: (message: string, error?: Error, context?: Context) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      requestId: context?.get('requestId'),
    }))
  },
}