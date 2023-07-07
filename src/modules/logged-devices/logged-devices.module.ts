import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggedDevice } from './entities/logged-device.entity';
import { LoggedDeviceEntity } from './logged-device-entity.service';
import { LoggedDevicesController } from './logged-devices.controller';
import { LoggedDevicesService } from './logged-devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoggedDevice])],
  exports: [LoggedDeviceEntity],
  controllers: [LoggedDevicesController],
  providers: [LoggedDevicesService, LoggedDeviceEntity],
})
export class LoggedDevicesModule {}
