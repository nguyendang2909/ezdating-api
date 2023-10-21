import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { DevicePlatform, DevicePlatforms } from '../../../commons/constants';

export class SignInDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEnum(DevicePlatforms)
  devicePlatform?: DevicePlatform;
}
