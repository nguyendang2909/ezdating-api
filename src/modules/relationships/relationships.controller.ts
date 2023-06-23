import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { CancelLikeRelationshipDto } from './dto/cancel-like-relationship.dto';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
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

  public async cancelLike(
    @Body() payload: CancelLikeRelationshipDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'cancelLikeRelationship',
      data: await this.relationshipsService.cancelLike(payload, currentUserId),
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

  @Get()
  findAll() {
    return this.relationshipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relationshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ) {
    return this.relationshipsService.update(+id, updateRelationshipDto);
  }
}
