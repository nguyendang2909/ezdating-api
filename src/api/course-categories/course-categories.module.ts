import { Module } from '@nestjs/common';

import { CourseCategoriesController } from './course-categories.controller';
import { CourseCategoriesService } from './course-categories.service';
import { CourseCategoriesScript } from './scripts/course-categories.script';

@Module({
  controllers: [CourseCategoriesController],
  providers: [CourseCategoriesService, CourseCategoriesScript],
})
export class CourseCategoriesModule {}
