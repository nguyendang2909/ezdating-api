import { Module } from '@nestjs/common';

import { EntitiesModule } from '../entities/entities.module';
import { UploadFilesController } from './upload-files.controller';
import { UploadFilesService } from './upload-files.service';

@Module({
  imports: [EntitiesModule],
  exports: [],
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
})
export class UploadFilesModule {}
