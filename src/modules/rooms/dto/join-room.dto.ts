import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class JoinRoomDto {
  @JoiSchema(
    Joi.string().guid().when('targetUserId', {
      not: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  )
  roomId: string;

  @JoiSchema(Joi.string().guid().optional())
  targetUserId: string;
}
