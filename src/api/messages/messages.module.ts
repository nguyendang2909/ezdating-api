import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { MessagesController } from './messages.controller';
import { MessagesReadService } from './services/messages-read.service';
import { MessagesWriteService } from './services/messages-write.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [MessagesController],
  providers: [MessagesReadService, MessagesWriteService],
})
export class MessagesModule {}
