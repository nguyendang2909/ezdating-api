import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [],
  exports: [],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
