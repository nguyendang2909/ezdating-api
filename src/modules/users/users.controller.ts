import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/swipe')
  public async findManySwipe(
    @Query() queryParams: FindManyDatingUsersDto,
    @Client() clientData: ClientData,
  ) {
    return await this.usersService.findManySwipe(queryParams, clientData);
  }

  @Get('/nearby')
  public async findManyNearby(
    @Body() queryParams: FindManyNearbyUsersQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.usersService.findManyNearby(queryParams, clientData);
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
