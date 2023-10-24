import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DEVICE_PLATFORMS } from '../../../constants';
import { DevicePlatform } from '../../../types';

export class SignInDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEnum(DEVICE_PLATFORMS)
  devicePlatform?: DevicePlatform;
}
