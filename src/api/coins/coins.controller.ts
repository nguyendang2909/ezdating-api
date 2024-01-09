import { Controller, Post } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post('/me/attendances')
  async findManyAttendances(@Client() clientData: ClientData) {
    return {
      type: RESPONSE_TYPES.DAILY_ATTENDANCE,
      ...(await this.coinsService.findManyAttendances(clientData)),
    };
  }
}
