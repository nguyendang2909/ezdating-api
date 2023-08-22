import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [ModelsModule, ChatsModule],
  exports: [],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
