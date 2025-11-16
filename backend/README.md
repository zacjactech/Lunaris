# Lunaris Backend

Backend API for the Lunaris Emotion Journal application built with NestJS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `JWT_SECRET` with a secure random string for production

3. The SQLite database will be automatically created in the `data/` folder on first run.

## Environment Variables

- `DB_PATH`: Path to SQLite database file (default: `data/sqlite.db`)
- `JWT_SECRET`: Secret key for JWT token signing (required for production)
- `PORT`: Server port (default: `3001`)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:3000`)

## Development

Start the development server with hot reload:
```bash
npm run start:dev
```

## Production

Build and start the production server:
```bash
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── entries/        # Journal entries module
├── common/         # Shared utilities and guards
├── app.module.ts   # Root application module
└── main.ts         # Application entry point
```

## Security Features

- Helmet middleware for security headers
- CORS configuration
- Input validation with class-validator
- Password hashing with bcrypt
- JWT authentication with refresh tokens
- HttpOnly cookies for refresh tokens
