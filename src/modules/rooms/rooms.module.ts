import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [RoomEntity],
  controllers: [RoomsController],
  providers: [RoomsService, RoomEntity],
})
export class RoomsModule {}
