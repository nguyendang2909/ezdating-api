import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EContactStatus } from '../contacts.constant';

@JoiSchemaOptions({ stripUnknown: true })
export class UpdateContactStatusDto {
  @ApiPropertyOptional({ type: Number, enum: EContactStatus })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...Object.values(EContactStatus)),
  )
  status: EContactStatus;
}
