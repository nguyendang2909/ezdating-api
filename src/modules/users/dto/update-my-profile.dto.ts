import JoiDate from '@joi/date';
import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EGender } from '../users.enum';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions({ stripUnknown: true })
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').optional().raw())
  birthDate: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(EGender))
      .optional(),
  )
  gender: EGender;
}
