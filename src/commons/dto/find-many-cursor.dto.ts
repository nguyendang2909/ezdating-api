import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EntityFactory } from '../lib/entity-factory';
import { DEFAULT_VALIDATION_OPTIONS } from './default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyCursorDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  @Transform(({ value }) => EntityFactory.decodeCursor(value))
  cursor?: string;
}
