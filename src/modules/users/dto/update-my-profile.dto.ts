import JoiDate from '@joi/date';
import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import {
  UserGender,
  UserGenders,
  UserLookingFor,
  UserLookingFors,
} from '../users.constant';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').optional().raw())
  birthday?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(UserGenders))
      .optional(),
  )
  gender?: UserGender;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(500).allow(null, '').optional())
  introduce?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(100).optional())
  nickname?: string;

  @ApiPropertyOptional({ type: String, enum: UserLookingFors })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(UserLookingFors))
      .optional(),
  )
  lookingFor?: UserLookingFor;

  country?: string;

  city?: string;
}
