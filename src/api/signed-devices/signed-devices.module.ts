import { Module } from '@nestjs/common';

import { SignedDevicesController } from './signed-devices.controller';
import { SignedDevicesService } from './signed-devices.service';

@Module({
  imports: [],
  exports: [],
  controllers: [SignedDevicesController],
  providers: [SignedDevicesService],
})
export class LoggedDevicesModule {}
