import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGeolocationDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
