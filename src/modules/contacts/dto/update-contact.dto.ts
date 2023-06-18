import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { EContactStatus } from '../contacts.constant';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateContactStatusDto {
  @ApiPropertyOptional({ type: Number, enum: EContactStatus })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...Object.values(EContactStatus)),
  )
  status: EContactStatus;
}
