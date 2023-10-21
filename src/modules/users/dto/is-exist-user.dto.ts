import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindOneUserDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  phoneNumber?: string;
}
