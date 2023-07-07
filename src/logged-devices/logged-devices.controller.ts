import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoggedDevicesService } from './logged-devices.service';
import { CreateLoggedDeviceDto } from './dto/create-logged-device.dto';
import { UpdateLoggedDeviceDto } from './dto/update-logged-device.dto';

@Controller('logged-devices')
export class LoggedDevicesController {
  constructor(private readonly loggedDevicesService: LoggedDevicesService) {}

  @Post()
  create(@Body() createLoggedDeviceDto: CreateLoggedDeviceDto) {
    return this.loggedDevicesService.create(createLoggedDeviceDto);
  }

  @Get()
  findAll() {
    return this.loggedDevicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loggedDevicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoggedDeviceDto: UpdateLoggedDeviceDto) {
    return this.loggedDevicesService.update(+id, updateLoggedDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loggedDevicesService.remove(+id);
  }
}
