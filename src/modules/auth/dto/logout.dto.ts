import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
