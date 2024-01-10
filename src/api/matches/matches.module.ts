import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ChatsModule } from '../../chats/chats.module';
import { BULL_QUEUE_EVENTS } from '../../constants';
import { ModelsModule } from '../../models/models.module';
import { MatchesConsumer } from './matches.consumer';
import { MatchesController } from './matches.controller';
import { MatchesPublisher } from './matches.publisher';
import { MatchesReadService } from './services/matches-read.service';
import { MatchesWriteService } from './services/matches-write.service';

@Module({
  imports: [
    ModelsModule,
    ChatsModule,
    BullModule.registerQueue({ name: BULL_QUEUE_EVENTS.MATCHES }),
  ],
  exports: [],
  controllers: [MatchesController],
  providers: [
    MatchesPublisher,
    MatchesConsumer,
    MatchesWriteService,
    MatchesReadService,
  ],
})
export class MatchesModule {}
