import { Module } from '@nestjs/common';

import { ModelsModule } from '../../models/models.module';
import { ViewsReadService } from './services/views-read.service';
import { ViewsWriteService } from './services/views-write.service';
import { ViewsController } from './views.controller';

@Module({
  controllers: [ViewsController],
  exports: [],
  imports: [ModelsModule],
  providers: [ViewsReadService, ViewsWriteService],
})
export class ViewsModule {}
