import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const user = { id: '1', email: registerDto.email, passwordHash: hashedPassword };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (usersService.create as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('token');

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.accessToken).toBe('token');
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = { id: '1', email: 'test@example.com', passwordHash: 'hashed' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'wrong');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const user = { id: '1', email: 'test@example.com', passwordHash: 'hashed' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrong');

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = '1';
      const email = 'test@example.com';
      (jwtService.sign as jest.Mock).mockReturnValue('token');

      const result = await service.generateTokens(userId, email);

      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
