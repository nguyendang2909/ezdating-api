import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getProfile', () => {
    it('Should get profile successfully', async () => {
      const mockCurrentUserId = '12345';

      const mockReturnGetProfile = createMock<User>({
        id: 'c3231a54-b18a-42ce-9606-3a624b32e9a8',
        createdAt: '2023-05-02T09:00:49.614Z',
        updatedAt: '2023-05-02T09:00:49.614Z',
        deletedAt: null,
        password:
          '$2b$10$zhlpdoc5oVYXfbpZTV8uy.ihZW4XfdPlizyKKPhWQu5P09t1wPvA6',
        phoneNumber: '+84971016191',
        firstName: 'Nguyen Dang',
        lastName: 'Quynh',
        email: null,
        birthdate: null,
        createdBy: null,
        updatedBy: null,
      });

      jest.spyOn(service, 'getProfile').mockResolvedValue(mockReturnGetProfile);

      const result = controller['getProfile'](mockCurrentUserId);

      await expect(result).resolves.toEqual({
        type: 'profile',
        data: mockCurrentUserId,
      });

      expect(service.getProfile).toHaveBeenCalledWith(mockCurrentUserId);
    });
  });
});
