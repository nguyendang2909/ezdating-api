import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import {
  REGEXS,
  UserGender,
  UserGenders,
  UserRelationshipGoal,
  UserRelationshipGoals,
} from '../../../commons/constants';

export class UpdateMyProfileBasicInfoDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(REGEXS.BIRTHDAY)
  birthday!: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsEnum(UserGenders)
  gender!: UserGender;

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(500)
  introduce?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nickname!: string;

  @ApiProperty({ type: Number, enum: UserRelationshipGoals })
  @IsNotEmpty()
  @IsEnum(UserRelationshipGoals)
  relationshipGoal!: UserRelationshipGoal;

  // @ApiProperty({ type: String })
  // @JoiSchema(Joi.number().required())
  // stateId?: number;
}
