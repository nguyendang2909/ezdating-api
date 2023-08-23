import JoiDate from '@joi/date';
import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import {
  UserGender,
  UserGenders,
  UserRelationshipGoal,
  UserRelationshipGoals,
} from '../../../commons/constants/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateMyProfileBasicInfoDto {
  @ApiProperty({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').required().raw())
  birthday!: string;

  @ApiProperty({ type: Number })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserGenders))
      .required(),
  )
  gender!: UserGender;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().max(500).allow(null, '').optional())
  introduce?: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().max(100).required())
  nickname!: string;

  @ApiProperty({ type: Number, enum: UserRelationshipGoals })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserRelationshipGoals))
      .required(),
  )
  relationshipGoal!: UserRelationshipGoal;

  // @ApiProperty({ type: String })
  // @JoiSchema(Joi.number().required())
  // stateId?: number;
}
