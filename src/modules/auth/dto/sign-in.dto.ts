import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DevicePlatform, DevicePlatforms } from '../../../commons/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class SignInDto {
  @JoiSchema(
    Joi.string().when('prev', {
      not: Joi.forbidden(),
      then: Joi.required(),
    }),
  )
  deviceToken?: string;

  @JoiSchema(Joi.string().valid(...Object.values(DevicePlatforms)))
  devicePlatform?: DevicePlatform;
}
