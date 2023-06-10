import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UsersAuthUtil } from './auth-users.util';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersUtil } from './users.util';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionsModule],
  exports: [UsersUtil, UsersAuthUtil],
  controllers: [UsersController],
  providers: [UsersService, UsersUtil, UsersAuthUtil],
})
export class UsersModule {}
