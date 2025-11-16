import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';

export async function initializeDatabase(dbPath: string): Promise<void> {
  // Ensure the directory exists (only if it's a relative path)
  const dbDir = path.dirname(dbPath);
  
  // Only create directory if it's not an absolute path or if we have permissions
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`Created database directory: ${dbDir}`);
    }
  } catch (error) {
    console.warn(`Could not create directory ${dbDir}, using current directory instead`);
    // If we can't create the directory, the database will be created in the current directory
  }

  const dataSource = new DataSource({
    type: 'sqlite',
    database: dbPath,
    entities: [User, Entry],
    synchronize: false, // Don't auto-sync to avoid data loss
    logging: false,
  });

  try {
    await dataSource.initialize();
    
    // Check if tables exist, create only if they don't
    const queryRunner = dataSource.createQueryRunner();
    
    try {
      // Check if users table exists
      const usersTableExists = await queryRunner.hasTable('users');
      if (!usersTableExists) {
        console.log('Creating users table...');
        await queryRunner.query(`
          CREATE TABLE "users" (
            "id" varchar PRIMARY KEY NOT NULL,
            "email" varchar NOT NULL UNIQUE,
            "passwordHash" varchar NOT NULL,
            "displayName" varchar,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
          )
        `);
        console.log('Users table created');
      }
      
      // Check if entries table exists
      const entriesTableExists = await queryRunner.hasTable('entries');
      if (!entriesTableExists) {
        console.log('Creating entries table...');
        await queryRunner.query(`
          CREATE TABLE "entries" (
            "id" varchar PRIMARY KEY NOT NULL,
            "emotion" varchar NOT NULL,
            "intensity" integer NOT NULL,
            "notes" text,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            "userId" varchar NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
          )
        `);
        console.log('Entries table created');
      }
      
      console.log('Database initialization complete');
    } finally {
      await queryRunner.release();
    }
    
    await dataSource.destroy();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
