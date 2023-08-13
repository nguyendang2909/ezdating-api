import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ModelsModule } from '../models/models.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [EncryptionsModule, ModelsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
