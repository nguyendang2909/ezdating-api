import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  @Get('/:id')
  private async findOneById(@Param('id') id: string) {
    return {
      type: 'profile',
      data: await this.usersService.findOneById(id),
    };
  }
}
