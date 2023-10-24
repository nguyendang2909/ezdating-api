import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { DEVICE_PLATFORMS } from '../../../constants';
import { DevicePlatform } from '../../../types';

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
  @IsEnum(DEVICE_PLATFORMS)
  devicePlatform: DevicePlatform;
}
