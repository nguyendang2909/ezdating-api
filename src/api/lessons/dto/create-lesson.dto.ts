import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;
}
