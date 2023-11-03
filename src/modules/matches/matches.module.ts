import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { BULL_QUEUE_EVENTS } from '../../constants';
import { ChatsModule } from '../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { UnmatchConsumer } from './consumers/unmatch.consumer';
import { MatchesController } from './matches.controller';
import { MatchesHandler } from './matches.handler';
import { MatchesPublisher } from './matches.publisher';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    ModelsModule,
    ChatsModule,
    BullModule.registerQueue({ name: BULL_QUEUE_EVENTS.UNMATCHED }),
  ],
  exports: [],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    MatchesPublisher,
    MatchesHandler,
    UnmatchConsumer,
  ],
})
export class MatchesModule {}
