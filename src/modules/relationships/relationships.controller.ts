import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindManyRoomsDto } from './dto/find-many-rooms.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { RelationshipsService } from './relationships.service';

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post('/status')
  public async sendStatus(
    @Body() payload: SendRelationshipStatusDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'sendRelationshipStatus',
      data: await this.relationshipsService.sendStatus(payload, currentUserId),
    };
  }

  @Get('/matched')
  public async findMatched(
    @Query() queryParams: FindMatchedRelationshipsDto,
    @UserId() userId: string,
  ) {
    return {
      type: 'matchedRelationships',
      ...(await this.relationshipsService.findMatched(queryParams, userId)),
    };
  }

  @Get('/rooms')
  public async findManyRooms(
    queryParams: FindManyRoomsDto,
    @UserId() userId: string,
  ) {
    return {
      type: 'findRooms',
      data: await this.relationshipsService.findManyRooms(queryParams, userId),
    };
  }
}
