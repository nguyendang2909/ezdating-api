import { PartialType } from '@nestjs/swagger';
import { CreateLoggedDeviceDto } from './create-logged-device.dto';

export class UpdateLoggedDeviceDto extends PartialType(CreateLoggedDeviceDto) {}
