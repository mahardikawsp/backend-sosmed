// src/modules/users/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/core/services/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,PrismaService,{
        provide: JwtService, // 💡 add jwt service here
        useValue: {
          signAsync: jest.fn(), // 💡 mock signAsync method
        },
      },],
    }).compile();

    controller = app.get<UsersController>(UsersController);
  });

  it('should be defined"', () => {
    expect(controller).toBeDefined();
  });

  describe('users controller', () => {
    // 💡 Test code goes here ...
  });
});