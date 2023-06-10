import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { CurrentUserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyRoomsDto } from './dto/find-many-room.dto';
import { FindOneRoomByIdDto } from './dto/find-one-room-by-id.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @Post()
  // create(@Body() createRoomDto: CreateRoomDto) {
  //   return this.roomsService.create(createRoomDto);
  // }

  @Get()
  private async findMany(
    @Query() findManyRoomsDto: FindManyRoomsDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return this.roomsService.findMany(findManyRoomsDto, currentUserId);
  }

  @Get(':id')
  findOneById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() findOneRoomByIdDto: FindOneRoomByIdDto,
    @CurrentUserId() currentUserId: string,
  ) {
    return this.roomsService.findOneOrFailById(
      id,
      findOneRoomByIdDto,
      currentUserId,
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomsService.update(+id, updateRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomsService.remove(+id);
  // }
}
