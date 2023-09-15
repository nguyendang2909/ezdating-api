import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyDatingUsersDto extends FindManyCursorQuery {
  @JoiSchema(Joi.array().items(Joi.string()))
  filterUserId: string[];

  @JoiSchema(Joi.number().optional())
  minDistance?: string;
}
