import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  controllers: [ViewsController],
  exports: [],
  imports: [ModelsModule],
  providers: [ViewsService],
})
export class ViewsModule {}
