import { Controller, Get } from '@nestjs/common';

import { CourseCategoriesService } from './course-categories.service';

@Controller('course-categories')
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.courseCategoriesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.courseCategoriesService.findOne(+id);
  // }
}
