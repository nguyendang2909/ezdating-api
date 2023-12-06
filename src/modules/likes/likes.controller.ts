import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { View } from '../models';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesService } from './likes.service';

@Controller('/likes')
@ApiTags('/likes')
@ApiBearerAuth('JWT')
export class LikesController {
  constructor(private readonly service: LikesService) {}

  @Post('/')
  public async send(
    @Body() payload: SendLikeDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'sendLike',
      data: await this.service.send(payload, clientData),
    };
  }

  @Get('/me')
  public async findManyLikedMe(
    @Query() queryParams: FindManyLikedMeDto,
    @Client() clientData: ClientData,
  ): Promise<PaginatedResponse<View>> {
    const likes = await this.service.findManyLikedMe(queryParams, clientData);
    return {
      type: 'likedMe',
      data: likes,
      pagination: this.service.getPagination(likes),
    };
  }

  @Get('/me/:id')
  public async findOneLikeMeById(
    @Param('id') id: string,
    @Client() client: ClientData,
  ) {
    return {
      type: 'likeMe',
      data: await this.service.findOneLikeMeById(id, client),
    };
  }
}
