import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindManyCoursesQuery } from './dto/find-many-courses.query';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @Client() client: ClientData,
  ) {
    return this.coursesService.createOne(createCourseDto, client);
  }

  @Get()
  findMany(
    @Query() queryParams: FindManyCoursesQuery,
    @Client() client: ClientData,
  ) {
    return this.coursesService.findMany(queryParams, client);
  }

  @Get(':id')
  findOneById(@Param('id') id: string, @Client() client: ClientData) {
    return this.coursesService.findOneById(id, client);
  }

  @Patch(':id')
  updateOneByid(
    @Param('id') id: string,
    @Body() payload: UpdateCourseDto,
    @Client() client: ClientData,
  ) {
    return this.coursesService.updateOneById(id, payload, client);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Client() client: ClientData) {
    return this.coursesService.deleteOneById(id, client);
  }
}
