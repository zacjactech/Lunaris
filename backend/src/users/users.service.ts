import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Check for existing user with same email
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    try {
      const user = this.usersRepository.create(userData);
      return await this.usersRepository.save(user);
    } catch (error) {
      // Handle database constraint violations
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);
    return await this.usersRepository.save(user);
  }

  async getUserStats(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['entries'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const entries = user.entries || [];
    const totalEntries = entries.length;

    // Calculate current streak
    const sortedDates = entries
      .map((e) => new Date(e.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates.length > 0) {
      if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        currentStreak = 0;
      } else {
        let currentDate = new Date();
        for (const dateStr of sortedDates) {
          const entryDate = new Date(dateStr);
          const diffDays = Math.floor(
            (currentDate.getTime() - entryDate.getTime()) / 86400000,
          );

          if (diffDays <= 1) {
            currentStreak++;
            currentDate = entryDate;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      tempStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const diff = Math.floor(
          (new Date(sortedDates[i]).getTime() -
            new Date(sortedDates[i + 1]).getTime()) /
            86400000,
        );
        if (diff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
    }

    return {
      totalEntries,
      currentStreak,
      longestStreak,
      memberSince: user.createdAt,
    };
  }
}