import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class BlockUserDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  targetUserId: string;
}
