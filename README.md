# Yes, even the readme.md is AI generated.

# Edge-Based Authentication API

This project is an edge-based authentication API built with Hono.js, designed to run on Cloudflare Workers. It provides user authentication, OTP generation and verification, and profile management functionalities.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup](#setup)
3. [API Endpoints](#api-endpoints)
4. [Development](#development)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Environment Variables](#environment-variables)
8. [Dependencies](#dependencies)

## Project Structure

```
project_root/
│
├── src/
│   ├── handlers/
│   │   ├── database_admin.ts
│   │   ├── expired_access_token.ts
│   │   ├── profile.ts
│   │   ├── send_otp.ts
│   │   └── verify_otp.ts
│   │
│   ├── models/
│   │   ├── employer.ts
│   │   └── job_seeker.ts
│   │
│   ├── repositories/
│   │   ├── employer_repository.ts
│   │   └── job_seeker_repository.ts
│   │
│   ├── schemas/
│   │   ├── auth.ts
│   │   ├── enums.ts
│   │   ├── expired_access_token.ts
│   │   ├── response.ts
│   │   ├── send_otp.ts
│   │   └── verify_otp.ts
│   │
│   ├── services/
│   │   ├── auth_service.ts
│   │   ├── email_service.ts
│   │   ├── otp_service.ts
│   │   └── token_service.ts
│   │
│   ├── shared/
│   │   ├── exceptions.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   │
│   ├── use_cases/
│   │   ├── database_admin.ts
│   │   ├── expired_access_token.ts
│   │   ├── profile.ts
│   │   ├── send_otp.ts
│   │   └── verify_otp.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rateLimit.ts
│   │
│   ├── di/
│   │   └── container.ts
│   │
│   ├── config.ts
│   ├── db.ts
│   └── index.ts
│
├── migrations/
│   └── (Drizzle migration files)
│
├── wrangler.toml
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Set up the database:
   ```
   npm run db:migrate
   ```

## API Endpoints

- `POST /admin`: Database administration (create/drop tables)
- `POST /token/refresh-expired-access-token`: Refresh an expired access token
- `POST /profile/user-profile`: Get user profile
- `POST /otp/send`: Send OTP for registration or login
- `POST /otp/verify`: Verify OTP and complete registration/login

For detailed API documentation, refer to the OpenAPI specification (if implemented).

## Development

To run the project locally:

```
npm run dev
```

This will start the development server using Wrangler.

## Deployment

To deploy to Cloudflare Workers:

```
npm run deploy
```

Ensure you have configured your Cloudflare account in Wrangler before deploying.

## Testing

To run tests:

```
npm test
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_sender_email@example.com
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
ENVIRONMENT=development
```

## Dependencies

- Hono: Web framework for Cloudflare Workers
- Drizzle ORM: Database ORM
- Zod: Schema validation
- JWT: Token generation and verification
- Resend: Email service

For a full list of dependencies, refer to `package.json`.

```

This documentation provides an overview of your project structure, setup instructions, API endpoints, development and deployment processes, and other important details. You can expand on each section as needed, adding more specific instructions or explanations for your team or other developers who might work on the project.

As for updating any code parts, based on our previous discussion, the main areas that might need attention are:

1. Ensure that the `Container` class in `src/di/container.ts` has a method to get the DB instance:

```typescript
// In src/di/container.ts
export class Container {
  // ... other methods

  getDB(): DB {
    return this.db
  }
}
```

2. Make sure that the `authMiddleware` in `src/middleware/auth.ts` is correctly using the `TokenService`:

```typescript
// In src/middleware/auth.ts
export const authMiddleware = (tokenService: TokenService) => {
  return async (c: Context, next: Next) => {
    // ... existing code
    try {
      const payload = tokenService.verifyAccessToken(token)
      c.set('user', payload)
      await next()
    } catch (error) {
      // ... error handling
    }
  }
}
```

3. Verify that all use cases are correctly using the injected dependencies.

4. Ensure that the `handleErrors` function in `src/shared/utils.ts` is properly handling all types of errors, including the custom `AppError`.

5. Check that the rate limiting middleware in `src/middleware/rateLimit.ts` is working as expected and integrated correctly in the main `index.ts` file.

These are the main areas to review based on the changes we've discussed. If you find any inconsistencies or need any further modifications, please let me know, and I'll be happy to help you update them.