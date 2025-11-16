import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';

export async function initializeDatabase(dbPath: string): Promise<void> {
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
