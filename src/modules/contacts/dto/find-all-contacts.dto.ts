import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindDto } from '../../../commons/dto/find.dto';
import { EContactStatus } from '../contacts.constant';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindAllContactsDto extends FindDto {
  @ApiProperty({ type: String, enum: EContactStatus })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(EContactStatus.accepted, EContactStatus.pending),
  )
  status!: EContactStatus;
}
