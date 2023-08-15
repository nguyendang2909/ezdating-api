import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [ModelsModule, ChatsModule],
  exports: [],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
