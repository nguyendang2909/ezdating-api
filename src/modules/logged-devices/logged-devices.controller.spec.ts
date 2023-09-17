import { Test, TestingModule } from '@nestjs/testing';

import { LoggedDevicesController } from './logged-devices.controller';
import { LoggedDevicesService } from './logged-devices.service';

describe('LoggedDevicesController', () => {
  let controller: LoggedDevicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggedDevicesController],
      providers: [LoggedDevicesService],
    }).compile();

    controller = module.get<LoggedDevicesController>(LoggedDevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
