import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { DevicePlatform, DevicePlatforms } from '../../../commons/constants';

export class UpdateSignedDeviceDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsEnum(DevicePlatforms)
  devicePlatform: DevicePlatform;
}
