import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-me-basic-info.dto';
import { MeService } from './me.service';

@Controller('/me')
@ApiTags('/me')
@ApiBearerAuth('JWT')
export class MeController {
  constructor(private readonly service: MeService) {}

  @Get('/')
  private async getProfile(@Client() clientData: ClientData) {
    return {
      type: 'profile',
      data: await this.service.get(clientData),
    };
  }

  @Patch('/')
  private async updateProfile(
    @Body() payload: UpdateMeDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'updateProfile',
      data: {
        success: await this.service.updateProfile(payload, clientData),
      },
    };
  }

  @Patch('/basic-info')
  private async updateProfileBasicInfo(
    @Body() payload: UpdateMyProfileBasicInfoDto,
    @Req() req: Request,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'updateProfileBasicInfo',
      data: await this.service.updateProfileBasicInfo(payload, req, clientData),
    };
  }

  @Post('/daily-attendance')
  async takeAttendance(@Client() clientData: ClientData) {
    return {
      type: 'dailyAttendance',
      data: await this.service.takeAttendance(clientData),
    };
  }

  @Post('/deactivate')
  async deactivate(@Client() clientData: ClientData) {
    return {
      type: 'deactivate',
      data: await this.service.deactivate(clientData),
    };
  }
}
