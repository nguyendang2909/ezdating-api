import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SignInDto } from './sign-in.dto';

export class SignInWithPhoneNumberAndPasswordDto extends SignInDto {
  @ApiProperty({ type: String, default: '+84971016191' })
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty({ type: String, default: 'Onlyone2@' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
