import { Module } from '@nestjs/common';

import { LoggedDevicesController } from './logged-devices.controller';
import { LoggedDevicesService } from './logged-devices.service';

@Module({
  imports: [],
  exports: [],
  controllers: [LoggedDevicesController],
  providers: [LoggedDevicesService],
})
export class LoggedDevicesModule {}
