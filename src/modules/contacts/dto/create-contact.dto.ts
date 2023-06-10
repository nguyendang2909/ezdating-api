import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({})
export class RequestFriendDto {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().guid().required())
  targetUserId!: string;
}
