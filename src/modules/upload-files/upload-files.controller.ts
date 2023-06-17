import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { AppConfig } from '../../app.config';
import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { UploadFilesService } from './upload-files.service';

@Controller('/upload-files')
@ApiTags('upload-files')
@ApiBearerAuth('JWT')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Post('/photos')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: AppConfig.MAX_UPLOAD_PHOTO_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          req.fileValidationError = 'goes wrong on the mimetype';

          return cb(
            new BadRequestException({
              errorCode: 'PHOTO_TYPE_INCORRECT',
              message: 'Photo type incorrect!',
            }),
            false,
          );
        }

        file.filename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, true);
      },
      // storage: diskStorage({
      //   destination: './temp',
      //   filename: (req, file, cb) => {
      //     const uniqueFilename = `${uuidv4()}${path.extname(
      //       file.originalname,
      //     )}`;

      //     cb(null, uniqueFilename);
      //   },
      // }),
    }),
  )
  private async uploadPhoto(
    @UserId() userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException({
        errorCode: 'FILE_NOT_FOUND',
        message: 'File not found!',
      });
    }
    return {
      type: 'uploadPhoto',
      data: await this.uploadFilesService.uploadPhoto(file, userId),
    };
  }

  @Get()
  findMany(
    @Query() queryParams: FindManyUploadFilesDto,
    @UserId() userId: string,
  ) {
    return this.uploadFilesService.findMany(queryParams, userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.uploadFilesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUploadFileDto: UpdateUploadFileDto,
  // ) {
  //   return this.uploadFilesService.update(+id, updateUploadFileDto);
  // }

  @Delete(':id')
  private async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return {
      type: 'removeFileUpload',
      data: await this.uploadFilesService.remove(id, userId),
    };
  }
}
