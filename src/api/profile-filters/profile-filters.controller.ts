import { Body, Controller, Get, Patch } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { UpdateProfileFilterDto } from './dto';
import { ProfileFiltersReadMeService } from './services/profile-filters-read-me.service';
import { ProfileFiltersWriteMeService } from './services/profile-filters-write-me.service';

@Controller('profile-filters')
export class ProfileFiltersController {
  constructor(
    private readonly readMeService: ProfileFiltersReadMeService,
    private readonly writeMeService: ProfileFiltersWriteMeService,
  ) {}

  @Patch('/me')
  async update(
    @Body() payload: UpdateProfileFilterDto,
    @Client() client: ClientData,
  ) {
    await this.writeMeService.updateOne(payload, client);
  }

  @Get('/me')
  async getMe(@Client() client: ClientData) {
    return {
      type: RESPONSE_TYPES.PROFILE_FILTER,
      data: await this.readMeService.findOne(client),
    };
  }
}
