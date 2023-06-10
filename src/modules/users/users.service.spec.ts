import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getProfile', () => {
  //   it('Should get profile successfully', async () => {
  //     const mockUserId = '1234565';

  //     const mockProfile = {
  //       id: mockUserId,
  //     };

  //     const createQueryBuilder: any = {
  //       andWhere: jest.fn().mockImplementation(() => {
  //         return createQueryBuilder;
  //       }),
  //       getOne: jest.fn().mockImplementation(() => {
  //         return mockProfile;
  //       }),
  //     };

  //     jest
  //       .spyOn(userRepository, 'createQueryBuilder')
  //       .mockImplementation(() => createQueryBuilder);

  //     const result = service.getProfile(mockUserId);

  //     await expect(result).resolves.toEqual(mockProfile);
  //   });
  // });
});
