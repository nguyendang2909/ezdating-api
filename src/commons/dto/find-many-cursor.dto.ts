import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EntityFactory } from '../lib/entity-factory';
import { FindDto } from './find.dto';

@JoiSchemaOptions({})
export class FindManyCursorDto extends FindDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  @Transform(({ value }) => EntityFactory.decodeCursor(value))
  cursor?: string;
}
