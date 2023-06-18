import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from './default-validation-options';
import { FindDto } from './find.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyDto extends FindDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
