import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DevicePlatform, DevicePlatforms } from '../../../commons/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateSignedDeviceDto {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  refreshToken: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  deviceToken: string;

  @ApiProperty({ type: String })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(DevicePlatforms))
      .required(),
  )
  devicePlatform: DevicePlatform;
}
