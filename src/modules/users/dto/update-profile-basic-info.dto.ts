import JoiDate from '@joi/date';
import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { EUserGender, EUserLookingFor } from '../users.constant';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateMyProfileBasicInfoDto {
  @ApiProperty({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').required().raw())
  birthday!: string;

  @ApiProperty({ type: String })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(EUserGender))
      .required(),
  )
  gender!: EUserGender;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().max(500).allow(null, '').optional())
  introduce?: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().max(100).required())
  nickname!: string;

  @ApiProperty({ type: String, enum: EUserLookingFor })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(EUserLookingFor))
      .required(),
  )
  lookingFor!: EUserLookingFor;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().length(2).required())
  country!: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  city!: string;
}
