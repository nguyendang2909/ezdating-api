import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsMongoId()
  courseCategoryId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subTitle?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  introductionVideoURL?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  output?: string;
}
