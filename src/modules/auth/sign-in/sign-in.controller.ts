import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../../commons/decorators/is-public.endpoint';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';
import { SignInService } from './sign-in.service';

@Controller('/auth/sign-in')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post('/phone-number')
  @IsPublicEndpoint()
  private async signInWithPhoneNumber(
    @Body() signInByPhoneNumberDto: SignInWithPhoneNumberDto,
  ) {
    return {
      type: 'sigInWithPhoneNumber',
      data: await this.signInService.signInWithPhoneNumber(
        signInByPhoneNumberDto,
      ),
    };
  }

  @Post('/phone-number/password')
  @IsPublicEndpoint()
  private async signInWithPhoneNumberAndPassword(
    @Body()
    signInWithPhoneNumberAndPasswordDto: SignInWithPhoneNumberAndPasswordDto,
  ) {
    return {
      type: 'signInWithPhoneNumberAndPassword',
      data: await this.signInService.signInWithPhoneNumberAndPassword(
        signInWithPhoneNumberAndPasswordDto,
      ),
    };
  }
}
