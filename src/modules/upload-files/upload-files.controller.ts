import {
  BadRequestException,
  Body,
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

import { AppConfig } from '../../app.config';
import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { FindOneUploadFileByIdDto } from './dto/find-one-upload-file-by-id.dto';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';
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
    const { isAvatar } = payload;

    return {
      type: 'uploadPhoto',
      data: await this.uploadFilesService.uploadPhoto(
        file,
        { isAvatar },
        userId,
      ),
    };
  }

  @Get()
  private async findMany(
    @Query() queryParams: FindManyUploadFilesDto,
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'uploadFiles',
      data: await this.uploadFilesService.findMany(queryParams, userId),
      pagination: {
        cursors: {
          before: null,
          after: null,
        },
      },
    };
  }

  @Get('/:id')
  findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParams: FindOneUploadFileByIdDto,
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'uploadFile',
      data: this.uploadFilesService.findOneOrFailById(id, queryParams, userId),
    };
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
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'removeFileUpload',
      data: { success: await this.uploadFilesService.remove(id, userId) },
    };
  }
}
