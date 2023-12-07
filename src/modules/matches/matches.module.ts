import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { BULL_QUEUE_EVENTS } from '../../constants';
import { ChatsModule } from '../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { MatchesConsumer } from './matches.consumer';
import { MatchesController } from './matches.controller';
import { MatchesHandler } from './matches.handler';
import { MatchesPublisher } from './matches.publisher';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    ModelsModule,
    ChatsModule,
    BullModule.registerQueue({ name: BULL_QUEUE_EVENTS.MATCHES }),
  ],
  exports: [],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    MatchesPublisher,
    MatchesHandler,
    MatchesConsumer,
  ],
})
export class MatchesModule {}
