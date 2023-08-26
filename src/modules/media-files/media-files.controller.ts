import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AppConfig } from '../../app.config';
import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';
import { MediaFilesService } from './media-files.service';

@Controller('/media-files')
@ApiTags('/media-files')
@ApiBearerAuth('JWT')
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @Post('/photos')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: AppConfig.UPLOAD_PHOTO_MAX_FILE_SIZE,
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

        // file.filename = `${uuidv4()}${path.extname(file.originalname)}`;
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
    @CurrentUserId() userId: string,
    @Body() payload: UploadPhotoDtoDto,
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
      data: await this.mediaFilesService.uploadPhoto(file, payload, userId),
    };
  }

  @Delete('/photos/:id')
  private async remove(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'removeFileUpload',
      data: { success: await this.mediaFilesService.deleteOne(id, userId) },
    };
  }
}
