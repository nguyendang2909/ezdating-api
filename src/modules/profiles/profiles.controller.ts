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
import { RESPONSE_TYPES, USER_ROLES } from '../../constants';
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Profile } from '../models';
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
      type: RESPONSE_TYPES.PROFILE,
      data: await this.service.getMe(clientData),
    };
  }

  @Patch('/me')
  private async updateMe(
    @Body() payload: UpdateMyProfileDto,
    @Client() clientData: ClientData,
  ): Promise<void> {
    await this.service.updateMe(payload, clientData);
  }
  // * End me api

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManySwipeProfilesQuery,
    @Client() clientData: ClientData,
  ): Promise<PaginatedResponse<Profile>> {
    const profiles = await this.swipeProfilesService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.SWIPE_PROFILES,
      data: profiles,
      pagination: { _next: null },
    };
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyNearbyProfilesQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.nearbyProfilesService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.NEARBY_PROFILES,
      data: findResults,
      pagination: this.nearbyProfilesService.getPagination(findResults),
    };
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
