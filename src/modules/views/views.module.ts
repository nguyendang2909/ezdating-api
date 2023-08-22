import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
