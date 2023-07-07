import { Injectable } from '@nestjs/common';
import { CreateLoggedDeviceDto } from './dto/create-logged-device.dto';
import { UpdateLoggedDeviceDto } from './dto/update-logged-device.dto';

@Injectable()
export class LoggedDevicesService {
  create(createLoggedDeviceDto: CreateLoggedDeviceDto) {
    return 'This action adds a new loggedDevice';
  }

  findAll() {
    return `This action returns all loggedDevices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loggedDevice`;
  }

  update(id: number, updateLoggedDeviceDto: UpdateLoggedDeviceDto) {
    return `This action updates a #${id} loggedDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} loggedDevice`;
  }
}
