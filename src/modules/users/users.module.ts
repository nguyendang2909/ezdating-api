import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UploadFilesModule } from '../upload-files/upload-files.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users-entity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EncryptionsModule,
    forwardRef(() => UploadFilesModule),
  ],
  exports: [UserEntity],
  controllers: [UsersController],
  providers: [UsersService, UserEntity],
})
export class UsersModule {}
