import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import {
  CreateProfileDto,
  FindManyDatingProfilesQuery,
  FindManyNearbyProfilesQuery,
  UpdateMyProfileDto,
} from './dto';
import { NearbyProfilesService } from './nearby-profiles.service';
import { ProfilesService } from './profiles.service';
import { SwipeProfilesService } from './swipe-profiles.service';

@Controller('/profiles')
@ApiTags('/profiles')
@ApiBearerAuth('JWT')
export class ProfilesController {
  constructor(
    private readonly service: ProfilesService,
    private readonly swipeProfilesService: SwipeProfilesService,
    private readonly nearbyProfilesService: NearbyProfilesService,
  ) {}

  @Post('/me')
  private async updateProfileBasicInfo(
    @Body() payload: CreateProfileDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'createProfile',
      data: await this.service.createOne(payload, client),
    };
  }

  @Get('/me')
  private async getProfile(@Client() clientData: ClientData) {
    return {
      type: 'profile',
      data: await this.service.getMe(clientData),
    };
  }

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManyDatingProfilesQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.swipeProfilesService.findMany(queryParams, clientData);
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyNearbyProfilesQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.nearbyProfilesService.findMany(queryParams, clientData);
  }

  @Patch('/me')
  private async updateProfile(
    @Body() payload: UpdateMyProfileDto,
    @Client() clientData: ClientData,
  ) {
    await this.service.updateMe(payload, clientData);
    return {
      type: 'updateProfile',
    };
  }
}
