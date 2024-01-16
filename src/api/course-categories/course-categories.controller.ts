import { Controller, Get, Param } from '@nestjs/common';

import { CourseCategoriesService } from './course-categories.service';

@Controller('course-categories')
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Get()
  async findAll() {
    return this.courseCategoriesService.findAll();
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string) {
    return await this.courseCategoriesService.findOneById(id);
  }
}
