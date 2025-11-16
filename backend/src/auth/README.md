# Authentication Module

This module provides JWT-based authentication for the Lunaris backend.

## Components

### JwtStrategy
Validates JWT tokens from the Authorization header and loads the user from the database.

### JwtAuthGuard
Protects routes by requiring a valid JWT token.

## Usage

To protect a route or controller, apply the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/entries')
@UseGuards(JwtAuthGuard) // Protects all routes in this controller
export class EntriesController {
  @Get()
  async getEntries() {
    // This route is now protected
  }
}
```

Or protect individual routes:

```typescript
@Controller('api/entries')
export class EntriesController {
  @Get()
  @UseGuards(JwtAuthGuard) // Protects only this route
  async getEntries() {
    // This route is now protected
  }
}
```

## Accessing the Authenticated User

The authenticated user is attached to the request object:

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/entries')
@UseGuards(JwtAuthGuard)
export class EntriesController {
  @Get()
  async getEntries(@Request() req) {
    const user = req.user; // The authenticated user object
    console.log(user.id, user.email);
  }
}
```
