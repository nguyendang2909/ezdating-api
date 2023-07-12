import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobService: JobsService) {}

  @Get()
  public async findAll() {
    return {
      type: 'userRelationshipStatuses',
      data: await this.jobService.findAll(),
    };
  }

  @Get('/:id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      type: 'userRelationshipStatus',
      data: await this.jobService.findOneOrFailById(id),
    };
  }
}
