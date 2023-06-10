import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class CreateRoomDto {
  @ApiProperty({ type: [String] })
  @JoiSchema(
    Joi.array()
      .required()
      .unique()
      .min(1)
      .items(Joi.string().guid().required()),
  )
  userIds: string[];
}
