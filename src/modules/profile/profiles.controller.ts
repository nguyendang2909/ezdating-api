import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  CurrentUser,
  UserId,
} from '../../commons/decorators/current-user-id.decorator';
import { User } from '../entities/entities/user.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';
import { ProfileService } from './profiles.service';

@Controller('/profile')
@ApiTags('/profile')
@ApiBearerAuth('JWT')
export class ProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/')
  private async getProfile(@UserId() currentUserId: string) {
    return {
      type: 'profile',
      data: await this.profileService.getProfile(currentUserId),
    };
  }

  @Patch('/')
  private async updateProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @UserId() currentUserId: string,
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
    @UserId() currentUserId: string,
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
  async getDailyCoin(@CurrentUser() user: User) {
    return {
      type: 'dailyCoin',
      data: await this.profileService.getDailyCoin(user),
    };
  }

  @Post('/deactivate')
  async deactivate(@UserId() userId: string) {
    return {
      type: 'deactivate',
      data: await this.profileService.deactivate(userId),
    };
  }
}
