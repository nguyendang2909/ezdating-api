import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from './default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyCursorDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string().optional().allow(null).when('before', {
      not: Joi.optional(),
      then: Joi.forbidden(),
    }),
  )
  after?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional().allow(null))
  before?: string;
}
