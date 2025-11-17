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
            "note" text NOT NULL,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "userId" varchar NOT NULL,
            FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
          )
        `);
        console.log('Entries table created');
      } else {
        // Migration: Check if old 'notes' column exists and rename to 'note'
        try {
          const tableInfo = await queryRunner.query(`PRAGMA table_info(entries)`);
          const hasNotesColumn = tableInfo.some((col: any) => col.name === 'notes');
          const hasNoteColumn = tableInfo.some((col: any) => col.name === 'note');
          
          if (hasNotesColumn && !hasNoteColumn) {
            console.log('Migrating: Renaming column "notes" to "note"...');
            // SQLite doesn't support RENAME COLUMN directly in older versions
            // We need to recreate the table
            await queryRunner.query(`
              CREATE TABLE "entries_new" (
                "id" varchar PRIMARY KEY NOT NULL,
                "emotion" varchar NOT NULL,
                "note" text NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userId" varchar NOT NULL,
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
              )
            `);
            await queryRunner.query(`
              INSERT INTO "entries_new" (id, emotion, note, createdAt, userId)
              SELECT id, emotion, notes, createdAt, userId FROM entries
            `);
            await queryRunner.query(`DROP TABLE entries`);
            await queryRunner.query(`ALTER TABLE entries_new RENAME TO entries`);
            console.log('Migration complete: Column renamed from "notes" to "note"');
          }
          
          // Remove intensity column if it exists
          const hasIntensityColumn = tableInfo.some((col: any) => col.name === 'intensity');
          if (hasIntensityColumn) {
            console.log('Migrating: Removing "intensity" column...');
            await queryRunner.query(`
              CREATE TABLE "entries_temp" (
                "id" varchar PRIMARY KEY NOT NULL,
                "emotion" varchar NOT NULL,
                "note" text NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userId" varchar NOT NULL,
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
              )
            `);
            await queryRunner.query(`
              INSERT INTO "entries_temp" (id, emotion, note, createdAt, userId)
              SELECT id, emotion, note, createdAt, userId FROM entries
            `);
            await queryRunner.query(`DROP TABLE entries`);
            await queryRunner.query(`ALTER TABLE entries_temp RENAME TO entries`);
            console.log('Migration complete: Removed "intensity" column');
          }
        } catch (migrationError) {
          console.warn('Migration check failed:', migrationError);
        }
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
