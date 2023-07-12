import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Job } from './entities/job.entity';
import { JobEntity } from './job-entity.service';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  exports: [JobEntity],
  controllers: [JobsController],
  providers: [JobsService, JobEntity],
})
export class JobsModule {}
