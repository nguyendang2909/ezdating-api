import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { View } from '../../models';
import { FindManyLikedMeQuery } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikedMeReadService } from './services/liked-me-read-service';
import { LikesWriteService } from './services/likes-write.service';

@Controller('/likes')
@ApiTags('/likes')
@ApiBearerAuth('JWT')
export class LikesController {
  constructor(
    private readonly likedMeReadService: LikedMeReadService,
    private readonly writeService: LikesWriteService,
  ) {}

  @Post('/')
  public async send(
    @Body() payload: SendLikeDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'sendLike',
      data: await this.writeService.createOne(payload, clientData),
    };
  }

  @Get('/me')
  public async findManyLikedMe(
    @Query() queryParams: FindManyLikedMeQuery,
    @Client() clientData: ClientData,
  ): Promise<PaginatedResponse<View>> {
    const likes = await this.likedMeReadService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: 'likedMe',
      data: likes,
      pagination: this.likedMeReadService.getPagination(likes),
    };
  }

  @Get('/me/:id')
  public async findOneLikeMeById(
    @Param('id') id: string,
    @Client() client: ClientData,
  ) {
    return {
      type: 'likeMe',
      data: await this.likedMeReadService.findOneById(id, client),
    };
  }
}
