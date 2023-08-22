import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [ModelsModule, ChatsModule],
  exports: [],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class RelationshipsModule {}
