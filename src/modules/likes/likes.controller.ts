import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
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
  ) {
    return await this.service.findManyLikedMe(queryParams, clientData);
  }

  @Get('/me/:id')
  public async findOneLikeMeById(
    @Param('id') id: string,
    @Client() client: ClientData,
  ) {
    return await this.service.findOneLikeMeById(id, client);
  }
}
