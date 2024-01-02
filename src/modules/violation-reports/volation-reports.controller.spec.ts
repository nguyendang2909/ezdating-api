import { Test, TestingModule } from '@nestjs/testing';
import { VolationReportsController } from './volation-reports.controller';
import { VolationReportsService } from './services/create-violation-report.service';

describe('VolationReportsController', () => {
  let controller: VolationReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolationReportsController],
      providers: [VolationReportsService],
    }).compile();

    controller = module.get<VolationReportsController>(VolationReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
