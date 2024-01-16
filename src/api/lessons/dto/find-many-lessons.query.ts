import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindManyLessonsQuery {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;
}
