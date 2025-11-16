import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entry.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
  ) {}

  async create(userId: string, createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = this.entriesRepository.create({
      ...createEntryDto,
      userId,
    });
    return await this.entriesRepository.save(entry);
  }

  async findByUserId(userId: string): Promise<Entry[]> {
    return await this.entriesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Entry> {
    const entry = await this.entriesRepository.findOne({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('You do not have access to this entry');
    }

    return entry;
  }

  async update(id: string, userId: string, updateEntryDto: UpdateEntryDto): Promise<Entry> {
    const entry = await this.findOne(id, userId);
    
    entry.note = updateEntryDto.note;
    return await this.entriesRepository.save(entry);
  }

  async delete(id: string, userId: string): Promise<void> {
    const entry = await this.findOne(id, userId);
    await this.entriesRepository.remove(entry);
  }
}
