import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GeolocationQuery {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumberString()
  latitude: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumberString()
  longitude: string;
}
