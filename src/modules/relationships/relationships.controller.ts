import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { CancelLikeRelationshipDto } from './dto/cancel-like-relationship.dto';
import { SendLikeRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { RelationshipsService } from './relationships.service';

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post()
  private async sendLike(
    @Body() payload: SendLikeRelationshipDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'sendLikeRelationship',
      data: await this.relationshipsService.sendLike(payload, currentUserId),
    };
  }

  private async cancelLike(
    @Body() payload: CancelLikeRelationshipDto,
    @UserId() currentUserId: string,
  ) {
    return {
      type: 'cancelLikeRelationship',
      data: await this.relationshipsService.cancelLike(payload, currentUserId),
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
