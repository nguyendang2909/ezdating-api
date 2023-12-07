import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class FindOneCountryParamsDto {
  @ApiProperty({ type: String, minLength: 2, maxLength: 2 })
  @IsNotEmpty()
  @IsString()
  @Length(2)
  id: string;
}
