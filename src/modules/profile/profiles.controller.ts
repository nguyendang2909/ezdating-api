import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';
import { ProfileService } from './profiles.service';

@Controller('/profile')
@ApiTags('/profile')
@ApiBearerAuth('JWT')
export class ProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/')
  private async getProfile(@Client() clientData: ClientData) {
    return {
      type: 'profile',
      data: await this.profileService.getProfile(clientData),
    };
  }

  @Patch('/')
  private async updateProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'updateProfile',
      data: {
        success: await this.profileService.updateProfile(
          updateMyProfileDto,
          clientData,
        ),
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
      data: await this.profileService.updateProfileBasicInfo(
        payload,
        req,
        clientData,
      ),
    };
  }

  @Post('/daily-attendance')
  async takeAttendance(@Client() clientData: ClientData) {
    return {
      type: 'dailyAttendance',
      data: await this.profileService.takeAttendance(clientData),
    };
  }

  @Post('/deactivate')
  async deactivate(@Client() clientData: ClientData) {
    return {
      type: 'deactivate',
      data: await this.profileService.deactivate(clientData),
    };
  }
}
