import { Test, TestingModule } from '@nestjs/testing';
import { VolationReportsService } from './services/create-violation-report.service';

describe('VolationReportsService', () => {
  let service: VolationReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VolationReportsService],
    }).compile();

    service = module.get<VolationReportsService>(VolationReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
