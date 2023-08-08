import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import {
  Client,
  CurrentUserId,
} from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindBlockedRelationshipsDto } from './dto/find-blocked-relationships.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { FindUsersLikeMeDto } from './dto/find-user-like-me.dto';
import { RelationshipsService } from './relationships.service';

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post('/status')
  public async sendStatus(
    @Body() payload: SendRelationshipStatusDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return {
      type: 'sendRelationshipStatus',
      data: await this.relationshipsService.sendStatus(payload, currentUserId),
    };
  }

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

  @Get('/blocked')
  async findBlocked(
    @Query() queryParams: FindBlockedRelationshipsDto,
    @Client() clientData: ClientData,
  ) {
    return this.relationshipsService.findBlocked(queryParams, clientData);
  }

  @Get('/like-me')
  findUsersLikeMe(
    @Query() queryParams: FindUsersLikeMeDto,
    @CurrentUserId() userId: string,
  ) {
    return {
      type: 'usersLikeMe',
      data: this.relationshipsService.findUsersLikeMe(queryParams, userId),
    };
  }
}
