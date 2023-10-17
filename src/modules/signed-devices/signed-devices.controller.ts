import { Body, Controller, Patch } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { UpdateSignedDeviceDto } from './dto';
import { SignedDevicesService } from './signed-devices.service';

@Controller('signed-devices')
export class SignedDevicesController {
  constructor(private readonly service: SignedDevicesService) {}

  @Patch()
  async update(
    @Body() payload: UpdateSignedDeviceDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'updateDeviceToken',
      data: await this.service.update(payload, client),
    };
  }
}
