import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from './default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyCursorQuery {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string().optional().allow(null).when('prev', {
      not: Joi.optional(),
      then: Joi.forbidden(),
    }),
  )
  _next?: string;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().optional().allow(null))
  // _prev?: string;
}
