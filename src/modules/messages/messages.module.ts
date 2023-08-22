import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
