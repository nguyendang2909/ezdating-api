import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from './find.dto';

@JoiSchemaOptions({ stripUnknown: true })
export class FindManyDto extends FindDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
