import { Test, TestingModule } from '@nestjs/testing';
import { LoggedDevicesService } from './logged-devices.service';

describe('LoggedDevicesService', () => {
  let service: LoggedDevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggedDevicesService],
    }).compile();

    service = module.get<LoggedDevicesService>(LoggedDevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
