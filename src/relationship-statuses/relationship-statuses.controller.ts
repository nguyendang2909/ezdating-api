import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRelationshipStatusesService } from './relationship-statuses.service';

@Controller('user-relationship-statuses')
@ApiTags('user-relationship-statuses')
@ApiBearerAuth('JWT')
export class UserRelationshipStatusesController {
  constructor(
    private readonly userRelationshipStatusesService: UserRelationshipStatusesService,
  ) {}

  @Get()
  public async findAll() {
    return {
      type: 'userRelationshipStatuses',
      data: await this.userRelationshipStatusesService.findAll(),
    };
  }

  @Get('/:id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      type: 'userRelationshipStatus',
      data: await this.userRelationshipStatusesService.findOneOrFailById(id),
    };
  }
}
