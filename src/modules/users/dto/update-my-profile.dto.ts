import JoiDate from '@joi/date';
import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { EGender } from '../users.constant';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions({ stripUnknown: true })
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').optional().raw())
  birthDay: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(EGender))
      .optional(),
  )
  gender: EGender;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(500).optional())
  introduce?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(100).optional())
  nickname?: string;

  country?: string;

  city?: string;
}
