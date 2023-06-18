import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { UploadFile } from './entities/upload-file.entity';
import { UploadFilesService } from './upload-files.service';
import { UploadFileEntity } from './upload-file-entity.service';
import { UploadFilesController } from './upload-files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile]), UsersModule],
  exports: [UploadFileEntity],
  controllers: [UploadFilesController],
  providers: [UploadFilesService, UploadFileEntity],
})
export class UploadFilesModule {}
