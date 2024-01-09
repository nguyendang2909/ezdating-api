import { Module } from '@nestjs/common';

import { ModelsModule } from '../../models/models.module';
import { MediaFilesController } from './media-files.controller';
import { MediaFilesService } from './media-files.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
})
export class MediaFilesModule {}
