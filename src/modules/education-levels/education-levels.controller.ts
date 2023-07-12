import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { EducationLevelsService } from './education-levels.service';

@Controller('education-levels')
export class EducationLevelsController {
  constructor(
    private readonly educationLevelsService: EducationLevelsService,
  ) {}

  @Get()
  public async findAll() {
    return {
      type: 'userRelationshipStatuses',
      data: await this.educationLevelsService.findAll(),
    };
  }

  @Get('/:id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      type: 'userRelationshipStatus',
      data: await this.educationLevelsService.findOneOrFailById(id),
    };
  }
}
