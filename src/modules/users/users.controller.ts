import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { FindOneUserDto } from './dto/is-exist-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/dating')
  public async findManyDating(
    @Query() queryParams: FindManyDatingUsersDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'users',
      ...(await this.usersService.findManyDating(queryParams, currentUserId)),
    };
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyDatingUsersDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'users',
      ...(await this.usersService.findManyNearby(queryParams, currentUserId)),
    };
  }

  @Get('/search')
  private async findOne(
    @Query() findOneUserDto: FindOneUserDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'user',
      data: await this.usersService.findOneOrFail(
        findOneUserDto,
        currentUserId,
      ),
    };
  }

  @Get('/profile')
  private async getProfile(@UserId() currentUserId: string) {
    return {
      type: 'profile',
      data: await this.usersService.getProfile(currentUserId),
    };
  }

  @Get('/:id')
  private async findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() findOneUserByIdDto: FindOneUserByIdDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'profile',
      data: await this.usersService.findOneOrFailById(
        id,
        findOneUserByIdDto,
        currentUserId,
      ),
    };
  }

  @Patch('/profile')
  private async updateProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfile',
      data: await this.usersService.updateProfile(
        updateMyProfileDto,
        currentUserId,
      ),
    };
  }

  @Patch('/profile/basic-info')
  private async updateProfileBasicInfo(
    @Body() payload: UpdateMyProfileBasicInfoDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'updateProfileBasicInfo',
      data: await this.usersService.updateProfileBasicInfo(
        payload,
        currentUserId,
      ),
    };
  }
}
