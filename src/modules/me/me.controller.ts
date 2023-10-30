import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { MeService } from './me.service';

@Controller('/me')
@ApiTags('/me')
@ApiBearerAuth('JWT')
export class MeController {
  constructor(private readonly service: MeService) {}

  @Post('/daily-attendance')
  async takeAttendance(@Client() clientData: ClientData) {
    return {
      type: 'dailyAttendance',
      data: await this.service.takeAttendance(clientData),
    };
  }

  // @Post('/deactivate')
  // async deactivate(@Client() clientData: ClientData) {
  //   return {
  //     type: 'deactivate',
  //     data: await this.service.deactivate(clientData),
  //   };
  // }
}
