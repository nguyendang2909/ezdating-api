import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EducationLevelEntity } from './education-level-entity.service';
import { EducationLevelsController } from './education-levels.controller';
import { EducationLevelsService } from './education-levels.service';
import { EducationLevel } from './entities/education-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationLevel])],
  exports: [EducationLevelEntity],
  controllers: [EducationLevelsController],
  providers: [EducationLevelsService, EducationLevelEntity],
})
export class EducationLevelsModule {}
