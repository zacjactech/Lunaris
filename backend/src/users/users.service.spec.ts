import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', passwordHash: 'hashed' };
      const savedUser = { id: '1', ...userData };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(userData);

      expect(result).toEqual(savedUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
    });

    it('should throw ConflictException if email exists', async () => {
      const userData = { email: 'test@example.com', passwordHash: 'hashed' };
      mockRepository.findOne.mockResolvedValue({ id: '1', ...userData });

      await expect(service.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findById('1');

      expect(result).toEqual(user);
    });
  });
});
