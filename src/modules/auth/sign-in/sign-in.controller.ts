import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../../commons/decorators/is-public.endpoint';
import { SignInWithGoogleDto } from '../dto';
import { SignInWithFacebookDto } from '../dto/sign-in-with-facebook.dto';
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
    @Body() payload: SignInWithPhoneNumberDto,
  ) {
    return {
      type: 'sigInWithPhoneNumber',
      data: await this.signInService.signInWithPhoneNumber(payload),
    };
  }

  @Post('/google')
  @IsPublicEndpoint()
  private async signInWithGoogle(@Body() payload: SignInWithGoogleDto) {
    return {
      type: 'sigInWithGoogle',
      data: await this.signInService.signInWithGoogle(payload),
    };
  }

  @Post('/facebook')
  @IsPublicEndpoint()
  private async signInWithFacebook(@Body() payload: SignInWithFacebookDto) {
    return {
      type: 'sigInWithFacebook',
      data: await this.signInService.signInWithFacebook(payload),
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
