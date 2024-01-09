import { Module } from '@nestjs/common';

import { ModelsModule } from '../../models/models.module';
import { ConversationsController } from './conversations.controller';
import { ConversationsReadService } from './services/conversations-read.service';

@Module({
  imports: [ModelsModule],
  controllers: [ConversationsController],
  providers: [ConversationsReadService],
})
export class ConversationsModule {}
