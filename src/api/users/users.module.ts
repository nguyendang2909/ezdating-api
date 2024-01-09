import { Module } from '@nestjs/common';

import { ModelsModule } from '../../models/models.module';
import { UsersReadMeService } from './services';
import { UsersBlockService } from './services/users-block.service';
import { UsersController } from './users.controller';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersReadMeService, UsersBlockService],
})
export class UsersModule {}
