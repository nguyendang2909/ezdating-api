import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';

import { DEVICE_PLATFORMS } from '../../../constants';
import { DevicePlatform } from '../../../types';

export class SignInDto {
  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => !!o.deviceToken || !!o.devicePlatform)
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ type: String })
  @ValidateIf((o) => !!o.deviceToken || !!o.devicePlatform)
  @IsEnum(DEVICE_PLATFORMS)
  devicePlatform?: DevicePlatform;
}
