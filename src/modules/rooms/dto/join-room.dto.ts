import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class CreateRoomDto {
  @ApiProperty({ type: [String] })
  @JoiSchema(
    Joi.array()
      .required()
      .unique()
      .min(1)
      .items(Joi.string().guid().required()),
  )
  userIds: string[];
}
