import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
}
