import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { FindDto } from '../../../commons/dto/find.dto';
import { EContactStatus } from '../contacts.constant';

@JoiSchemaOptions({ stripUnknown: true })
export class FindAllContactsDto extends FindDto {
  @ApiProperty({ type: String, enum: EContactStatus })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(EContactStatus.accepted, EContactStatus.pending),
  )
  status!: EContactStatus;
}
