import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { Entry } from './entry.entity';

describe('EntriesService', () => {
  let service: EntriesService;
  let mockRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntriesService,
        {
          provide: getRepositoryToken(Entry),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EntriesService>(EntriesService);
  });

  describe('create', () => {
    it('should create a new entry', async () => {
      const userId = 'user1';
      const createDto = { emotion: 'Happy', note: 'Feeling great!' };
      const entry = { id: '1', userId, ...createDto };

      mockRepository.create.mockReturnValue(entry);
      mockRepository.save.mockResolvedValue(entry);

      const result = await service.create(userId, createDto);

      expect(result).toEqual(entry);
      expect(mockRepository.create).toHaveBeenCalledWith({ ...createDto, userId });
    });
  });

  describe('findByUserId', () => {
    it('should return entries for user ordered by createdAt DESC', async () => {
      const userId = 'user1';
      const entries = [
        { id: '1', userId, emotion: 'Happy', note: 'Test' },
        { id: '2', userId, emotion: 'Sad', note: 'Test2' },
      ];

      mockRepository.find.mockResolvedValue(entries);

      const result = await service.findByUserId(userId);

      expect(result).toEqual(entries);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return entry if user owns it', async () => {
      const userId = 'user1';
      const entry = { id: '1', userId, emotion: 'Happy', note: 'Test' };

      mockRepository.findOne.mockResolvedValue(entry);

      const result = await service.findOne('1', userId);

      expect(result).toEqual(entry);
    });

    it('should throw NotFoundException if entry does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own entry', async () => {
      const entry = { id: '1', userId: 'user2', emotion: 'Happy', note: 'Test' };
      mockRepository.findOne.mockResolvedValue(entry);

      await expect(service.findOne('1', 'user1')).rejects.toThrow(ForbiddenException);
    });
  });
});
