import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadFile } from './entities/upload-file.entity';
import { UploadFileEntity } from './upload-file-entity.service';
import { UploadFilesController } from './upload-files.controller';
import { UploadFilesService } from './upload-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile])],
  exports: [UploadFileEntity],
  controllers: [UploadFilesController],
  providers: [UploadFilesService, UploadFileEntity],
})
export class UploadFilesModule {}
