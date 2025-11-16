import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';

export async function initializeDatabase(dbPath: string): Promise<void> {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: dbPath,
    entities: [User, Entry],
    synchronize: true, // Only used for initialization
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database initialized successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
