import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
