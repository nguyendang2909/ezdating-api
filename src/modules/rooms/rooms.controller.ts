import { Controller, Get, Post, Query } from '@nestjs/common';

import { UserId } from '../../commons/decorators/current-user-id.decorator';
import { FindManyRoomsDto } from './dto/find-many-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  private async joinRoom() {}

  // @Post()
  // create(@Body() createRoomDto: CreateRoomDto) {
  //   return this.roomsService.create(createRoomDto);
  // }

  @Get()
  private async findMany(
    @Query() findManyRoomsDto: FindManyRoomsDto,
    @UserId() currentUserId: string,
  ) {
    // return this.roomsService.findMany(findManyRoomsDto, currentUserId);
  }

  // @Get(':id')
  // findOneById(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Query() findOneRoomByIdDto: FindOneRoomByIdDto,
  //   @UserId() currentUserId: string,
  // ) {
  //   return this.roomsService.findOneOrFailById(
  //     id,
  //     findOneRoomByIdDto,
  //     currentUserId,
  //   );
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomsService.update(+id, updateRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomsService.remove(+id);
  // }
}
