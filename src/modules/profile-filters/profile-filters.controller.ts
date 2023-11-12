import { Body, Controller, Get, Patch } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { UpdateProfileFilterDto } from './dto';
import { ProfileFiltersService } from './profile-filters.service';

@Controller('profile-filters')
export class ProfileFiltersController {
  constructor(private readonly service: ProfileFiltersService) {}

  @Patch('/me')
  async update(
    @Body() payload: UpdateProfileFilterDto,
    @Client() client: ClientData,
  ) {
    return await this.service.updateMe(payload, client);
  }

  @Get('/me')
  async getMe(@Client() client: ClientData) {
    return await this.service.getMe(client);
  }
}
