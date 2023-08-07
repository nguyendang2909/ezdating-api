import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import {
  Client,
  CurrentUserId,
} from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { BlockUserDto } from './dto/block-user.dto';
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

  @Get('/blocked')
  async getBlockedUsers(@CurrentUserId() currentUserId: string) {
    return {
      type: 'blockedUsers',
      data: await this.profileService.getBlockedUsers(currentUserId),
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

  @Patch('/block')
  async blockUser(
    @Body() payload: BlockUserDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'blockUser',
      data: await this.profileService.blockUser(payload, currentUserId),
    };
  }

  @Patch('/basic-info')
  private async updateProfileBasicInfo(
    @Body() payload: UpdateMyProfileBasicInfoDto,
    @Req() req: Request,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfileBasicInfo',
      data: await this.profileService.updateProfileBasicInfo(
        payload,
        req,
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
