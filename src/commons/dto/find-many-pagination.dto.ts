import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

import { FindManyDto } from './find-many.dto';

export class FindManyPaginationDto extends FindManyDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumberString()
  page?: string;
}
