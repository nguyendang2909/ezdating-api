import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GeolocationQuery {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumberString()
  latitude: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumberString()
  longitude: string;
}
