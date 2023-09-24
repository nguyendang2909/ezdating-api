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

import { APP_CONFIG } from '../../app.config';
import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
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
        fileSize: APP_CONFIG.UPLOAD_PHOTO_MAX_FILE_SIZE,
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
    @Client() clientData: ClientData,
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
      data: await this.mediaFilesService.uploadPhoto(file, payload, clientData),
    };
  }

  @Delete('/photos/:id')
  private async remove(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'removeFileUpload',
      data: { success: await this.mediaFilesService.deleteOne(id, clientData) },
    };
  }
}
