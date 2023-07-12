import { Test, TestingModule } from '@nestjs/testing';

import { UserRelationshipStatusesService } from './relationship-statuses.service';

describe('UserRelationshipStatusesService', () => {
  let service: UserRelationshipStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRelationshipStatusesService],
    }).compile();

    service = module.get<UserRelationshipStatusesService>(
      UserRelationshipStatusesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
