import { Test, TestingModule } from '@nestjs/testing';
import { ProfileFiltersService } from './profile-filters.service';

describe('ProfileFiltersService', () => {
  let service: ProfileFiltersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileFiltersService],
    }).compile();

    service = module.get<ProfileFiltersService>(ProfileFiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
