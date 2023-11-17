import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RequireRoles } from '../../commons/decorators/require-roles.decorator';
import { USER_ROLES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import {
  CreateProfileDto,
  FindManyNearbyProfilesQuery,
  FindManySwipeProfilesQuery,
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

  // * Me api
  @Post('/me')
  async createProfile(
    @Body() payload: CreateProfileDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'createProfile',
      data: await this.service.createOne(payload, client),
    };
  }

  @Get('/me')
  async getProfile(@Client() clientData: ClientData) {
    return {
      type: 'profile',
      data: await this.service.getMe(clientData),
    };
  }

  @Patch('/me')
  private async updateMe(
    @Body() payload: UpdateMyProfileDto,
    @Client() clientData: ClientData,
  ) {
    await this.service.updateMe(payload, clientData);
    return {
      type: 'updateProfile',
    };
  }
  // * End me api

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManySwipeProfilesQuery,
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

  @Get('/test')
  @RequireRoles([USER_ROLES.ADMIN])
  async test() {
    return await this.nearbyProfilesService.test();
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() client: ClientData,
  ) {
    return await this.service.findOneOrFailById(id, client);
  }
}
