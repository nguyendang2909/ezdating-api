import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  Client,
  CurrentUserId,
} from '../../commons/decorators/current-user-id.decorator';
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
  private async getProfile(@CurrentUserId() currentUserId: string) {
    return {
      type: 'profile',
      data: await this.profileService.getProfile(currentUserId),
    };
  }

  @Patch('/')
  private async updateProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfile',
      data: await this.profileService.updateProfile(
        updateMyProfileDto,
        currentUserId,
      ),
    };
  }

  @Patch('/basic-info')
  private async updateProfileBasicInfo(
    @Body() payload: UpdateMyProfileBasicInfoDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfileBasicInfo',
      data: await this.profileService.updateProfileBasicInfo(
        payload,
        currentUserId,
      ),
    };
  }

  @Post('/coin/daily')
  async getDailyCoin(@Client() clientData: ClientData) {
    return {
      type: 'dailyCoin',
      data: await this.profileService.getDailyCoin(clientData),
    };
  }

  @Post('/deactivate')
  async deactivate(@CurrentUserId() userId: string) {
    return {
      type: 'deactivate',
      data: await this.profileService.deactivate(userId),
    };
  }
}
