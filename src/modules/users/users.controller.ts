import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/dating')
  public async findManyDating(
    @Query() queryParams: FindManyDatingUsersDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'users',
      ...(await this.usersService.findManyDating(queryParams, currentUserId)),
    };
  }

  @Get('/nearby')
  public async findManyNearby(
    @Query() queryParams: FindManyDatingUsersDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return await this.usersService.findManyNearby(queryParams, currentUserId);
  }

  @Get('/:id')
  private async findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'profile',
      data: await this.usersService.findOneOrFailById(id, currentUserId),
    };
  }
}
