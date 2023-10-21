import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { DevicePlatform, DevicePlatforms } from '../../../commons/constants';

export class SignInDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ type: String })
  @IsEnum(DevicePlatforms)
  devicePlatform?: DevicePlatform;
}
