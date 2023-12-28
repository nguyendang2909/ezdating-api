import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { UsersReadMeService } from './services';
import { UsersController } from './users.controller';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersReadMeService],
})
export class UsersModule {}
