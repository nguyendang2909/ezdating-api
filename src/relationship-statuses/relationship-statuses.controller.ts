import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RelationshipStatusesService } from './relationship-statuses.service';

@Controller('user-relationship-statuses')
@ApiTags('user-relationship-statuses')
@ApiBearerAuth('JWT')
export class RelationshipStatusesController {
  constructor(
    private readonly relationshipStatusesService: RelationshipStatusesService,
  ) {}

  @Get()
  public async findAll() {
    return {
      type: 'userRelationshipStatuses',
      data: await this.relationshipStatusesService.findAll(),
    };
  }

  @Get('/:id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      type: 'userRelationshipStatus',
      data: await this.relationshipStatusesService.findOneOrFailById(id),
    };
  }
}
