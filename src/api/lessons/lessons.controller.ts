import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { APP_CONFIG } from '../../app.config';
import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyLessonsQuery } from './dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() payload: CreateLessonDto, @Client() client: ClientData) {
    return this.lessonsService.createOne(payload, client);
  }

  @Get()
  findMany(
    @Query() queryParams: FindManyLessonsQuery,
    @Client() client: ClientData,
  ) {
    return this.lessonsService.findMany(queryParams, client);
  }

  @Get(':id')
  findOneById(@Param('id') id: string, @Client() client: ClientData) {
    return this.lessonsService.findOneById(id, client);
  }

  @Patch(':id')
  updateOneById(
    @Param('id') id: string,
    @Body() payload: UpdateLessonDto,
    @Client() client: ClientData,
  ) {
    return this.lessonsService.updateOneById(id, payload, client);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Client() client: ClientData) {
    return this.lessonsService.deleteOneById(id, client);
  }

  @Post('/:id/video/')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: APP_CONFIG.FILE.VIDEO.MAX_UPLOAD_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('video')) {
          req.fileValidationError = 'goes wrong on the mimetype';

          return cb(new BadRequestException('The file is not video'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadVideo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Client() client: ClientData,
  ) {
    if (!file) {
      throw new BadRequestException('Choose file');
    }

    return {
      type: 'updateLessonVideo',
      data: await this.lessonsService.uploadVideo(id, file, client),
    };
  }
}
