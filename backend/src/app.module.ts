import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntriesModule } from './entries/entries.module';
import { User } from './users/user.entity';
import { Entry } from './entries/entry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Convert absolute paths to relative paths for compatibility
        let dbPath = configService.get('DB_PATH') || './data/sqlite.db';
        
        // If path starts with /data, convert to relative path
        if (dbPath.startsWith('/data')) {
          dbPath = '.' + dbPath;
          console.log(`[TypeORM] Converted absolute path to relative: ${dbPath}`);
        }
        
        return {
          type: 'sqlite',
          database: dbPath,
          entities: [User, Entry],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'lunaris-secret-key-fallback',
        signOptions: { expiresIn: '15m' },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 5, // 5 requests per 60 seconds
      },
    ]),
    AuthModule,
    UsersModule,
    EntriesModule,
  ],
})
export class AppModule { }