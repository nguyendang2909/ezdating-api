import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  phoneNumber: string;
}
