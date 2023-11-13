import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/')
  // public async findMany(@Query() queryParams: FindManyNearbyUsersQuery) {
  //   return await this.usersService.findMany(queryParams);
  // }

  @Get('/me')
  async findOneById(@Client() client: ClientData) {
    return {
      type: 'user',
      data: await this.usersService.findMe(client),
    };
  }
}
