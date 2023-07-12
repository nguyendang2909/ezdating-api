import { Test, TestingModule } from '@nestjs/testing';

import { UserRelationshipStatusesController } from './relationship-statuses.controller';
import { UserRelationshipStatusesService } from './relationship-statuses.service';

describe('UserRelationshipStatusesController', () => {
  let controller: UserRelationshipStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRelationshipStatusesController],
      providers: [UserRelationshipStatusesService],
    }).compile();

    controller = module.get<UserRelationshipStatusesController>(
      UserRelationshipStatusesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
