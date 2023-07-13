import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
