export class AppError extends Error {
    constructor(
      public code: string,
      message: string,
      public statusCode: number
    ) {
      super(message)
      this.name = 'AppError'
    }
  }
  
  export const ErrorCode = {
    INVALID_INPUT: new AppError('VAL001', 'Invalid input', 400),
    RESOURCE_NOT_FOUND: new AppError('RES001', 'Resource not found', 404),
    INVALID_ROLE: new AppError('ROL001', 'Invalid user role', 400),
    UNAUTHORIZED: new AppError('UNA001', 'Missing or invalid Authorization header', 401),
    TOKEN_EXPIRED: new AppError('TOK111', 'Token is expired', 401),
    TOKEN_NOT_EXPIRED: new AppError('TOK222', 'Token is not expired', 400),
    INVALID_TOKEN: new AppError('TOK223', 'Invalid Token', 401),
    DATABASE_ERROR: new AppError('DB001', 'Database error', 500),
    EXTERNAL_SERVICE_ERROR: new AppError('EXT001', 'External service error', 502),
    INTERNAL_SERVER_ERROR: new AppError('SRV001', 'Internal server error', 500),
    // ... add other error codes as needed
  }