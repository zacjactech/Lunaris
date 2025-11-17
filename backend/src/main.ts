import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/init';

// Load environment variables
dotenv.config();

async function bootstrap() {
  // Initialize database tables if they don't exist
  // Convert absolute paths to relative paths for compatibility
  let dbPath = process.env.DB_PATH || './data/sqlite.db';
  
  // If path starts with /data, convert to relative path
  if (dbPath.startsWith('/data')) {
    dbPath = '.' + dbPath;
    console.log(`Converted absolute path to relative: ${dbPath}`);
  }
  
  await initializeDatabase(dbPath);
  const app = await NestFactory.create(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Security middleware
  app.use(helmet());
  app.use(cookieParser());
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Lunaris backend running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});