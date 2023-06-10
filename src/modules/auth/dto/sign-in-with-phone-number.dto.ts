import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ stripUnknown: true })
export class SignInWithPhoneNumberDto {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  token!: string;
}
