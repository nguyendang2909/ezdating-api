import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyDatingUsersQuery } from './dto/find-many-dating-users.dto';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
import { NearbyUsersService } from './nearby-users.service';
import { SwipeUsersService } from './swipe-users.service';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly nearbyUsersService: NearbyUsersService,
    private readonly swipeUsersService: SwipeUsersService,
  ) {}

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManyDatingUsersQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.swipeUsersService.findMany(queryParams, clientData);
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyNearbyUsersQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.nearbyUsersService.findMany(queryParams, clientData);
  }

  @Get('/:id')
  private async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'profile',
      data: await this.usersService.findOneOrFailById(id, clientData),
    };
  }
}
