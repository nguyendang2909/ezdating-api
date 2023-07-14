import JoiDate from '@joi/date';
import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import {
  UserEducationLevel,
  UserEducationLevels,
  UserGender,
  UserGenders,
  UserLookingFor,
  UserLookingFors,
  UserRelationshipStatus,
  UserRelationshipStatuses,
} from '../../../commons/constants/enums';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').optional().raw())
  birthday?: string;

  @ApiPropertyOptional({ type: Number, enum: UserEducationLevels })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserEducationLevels))
      .optional(),
  )
  educationLevel: UserEducationLevel;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @JoiSchema(
    Joi.number()
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

  @ApiPropertyOptional({ type: Number, enum: UserLookingFors })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserLookingFors))
      .optional(),
  )
  lookingFor?: UserLookingFor;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().optional())
  avatarFileId?: string;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().optional())
  longitude?: number;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().optional())
  latitude?: number;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipStatuses })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserRelationshipStatuses))
      .optional(),
  )
  relationshipStatus: UserRelationshipStatus;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().required())
  stateId?: number;
}
