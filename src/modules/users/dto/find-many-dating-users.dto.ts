import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyDatingUsersQuery extends FindManyCursorQuery {
  @ApiPropertyOptional({ type: [String] })
  @JoiSchema(
    Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  )
  excludedUserId?: string[] | string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.number().optional())
  minDistance?: string;
}
