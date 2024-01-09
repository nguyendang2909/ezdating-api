import { IsNotEmpty, IsString } from 'class-validator';

import { SignInDto } from './sign-in.dto';

export class SignInWithFacebookDto extends SignInDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
