import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  Client,
  CurrentUserId,
} from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { FindUsersLikeMeDto } from './dto/find-user-like-me.dto';
import { RelationshipsService } from './relationships.service';

@Controller('/relationships')
@ApiTags('/relationships')
@ApiBearerAuth('JWT')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post('/status/like/:targetUserId')
  public async sendLikeStatus(
    @Client() clientData: ClientData,
    @Param('targetUserId') targetUserId: string,
  ) {
    return {
      type: 'sendRelationshipStatus',
      data: await this.relationshipsService.sendLikeStatus(
        targetUserId,
        clientData,
      ),
    };
  }

  @Post('/matches/cancel/:id')
  public async cancelMatched(
    @Client() clientData: ClientData,
    @Param('id') id: string,
  ) {
    return {
      type: 'cancelMatched',
      data: await this.relationshipsService.cancelMatched(id, clientData),
    };
  }

  @Post('/matches/')
  public async createMatch(
    @Body() payload: CreateMatchDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'cancelMatched',
      data: await this.relationshipsService.createMatch(payload, clientData),
    };
  }

  // @Post('/status')
  // public async sendStatus(
  //   @Body() payload: SendRelationshipStatusDto,
  //   @CurrentUserId() currentUserId: string,
  // ) {
  //   return {
  //     type: 'sendRelationshipStatus',
  //     data: await this.relationshipsService.sendStatus(payload, currentUserId),
  //   };
  // }

  @Get('/matched')
  public async findMatched(
    @Query() queryParams: FindMatchedRelationshipsDto,
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'matchedRelationships',
      ...(await this.relationshipsService.findMatched(queryParams, userId)),
    };
  }

  @Get('/liked-me')
  findManyLikedMe(
    @Query() queryParams: FindUsersLikeMeDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'usersLikeMe',
      data: this.relationshipsService.findManyLikedMe(queryParams, clientData),
    };
  }
}
