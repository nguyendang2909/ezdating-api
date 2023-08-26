import JoiDate from '@joi/date';
import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import {
  UserEducationLevel,
  UserEducationLevels,
  UserGender,
  UserGenders,
  UserRelationshipGoal,
  UserRelationshipGoals,
  UserRelationshipStatus,
  UserRelationshipStatuses,
} from '../../../commons/constants/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

const JoiExtendDate = Joi.extend(JoiDate);

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class UpdateMyProfileDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(JoiExtendDate.date().format('YYYY-MM-DD').optional().raw())
  birthday?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string())
  company?: string;

  @ApiPropertyOptional({ type: Number, enum: UserEducationLevels })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserEducationLevels))
      .optional(),
  )
  educationLevel?: UserEducationLevel;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @JoiSchema(Joi.number().valid(...Object.values(UserGenders)))
  filterGender?: UserGender;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number())
  filterMaxDistance?: number;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().min(18).max(99))
  filterMinAge?: number;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().min(18).max(99))
  filterMaxAge?: number;

  @ApiPropertyOptional({ type: Number, enum: UserGenders })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserGenders))
      .optional(),
  )
  gender?: UserGender;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number())
  height?: string;

  @ApiPropertyOptional({ type: Boolean })
  @JoiSchema(Joi.boolean())
  hideAge?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @JoiSchema(Joi.boolean())
  hideDistance?: boolean;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(500).allow(null, '').optional())
  introduce?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string())
  jobTitle?: string;

  @ApiPropertyOptional({ type: [String] })
  @JoiSchema(Joi.array().items(Joi.string()))
  languages: string[];

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().optional())
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().optional())
  longitude?: number;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().max(100).optional())
  nickname?: string;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipGoals })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserRelationshipGoals))
      .optional(),
  )
  relationshipGoal?: UserRelationshipGoal;

  // @ApiPropertyOptional({ type: String })
  // @JoiSchema(Joi.string().guid().optional())
  // avatarFileId?: string;

  @ApiPropertyOptional({ type: Number, enum: UserRelationshipStatuses })
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserRelationshipStatuses))
      .optional(),
  )
  relationshipStatus: UserRelationshipStatus;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string())
  school?: string;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number())
  weight: number;

  // @ApiPropertyOptional({ type: Number })
  // @JoiSchema(Joi.number().optional())
  // stateId?: number;
}
