import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../../commons/decorators/is-public.endpoint';
import { SignInWithGoogleDto } from '../dto';
import { SignInWithFacebookDto } from '../dto/sign-in-with-facebook.dto';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';
import { SignInFacebookService } from './sign-in-facebook.service';
import { SignInGoogleService } from './sign-in-google.service';
import { SignInPhoneNumberService } from './sign-in-phone-number.service';
import { SignInPhoneNumberWithPasswordService } from './sign-in-phone-number-with-password.service';

@Controller('/auth/sign-in')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
export class SignInController {
  constructor(
    private readonly signInPhoneNumberService: SignInPhoneNumberService,
    private readonly signInFacebookService: SignInFacebookService,
    private readonly signInGoogleService: SignInGoogleService,
    private readonly signInPhoneNumberWithPasswordService: SignInPhoneNumberWithPasswordService,
  ) {}

  @Post('/phone-number')
  @IsPublicEndpoint()
  private async signInWithPhoneNumber(
    @Body() payload: SignInWithPhoneNumberDto,
  ) {
    return {
      type: 'sigInWithPhoneNumber',
      data: await this.signInPhoneNumberService.signIn(payload),
    };
  }

  @Post('/google')
  @IsPublicEndpoint()
  private async signInWithGoogle(@Body() payload: SignInWithGoogleDto) {
    return {
      type: 'sigInWithGoogle',
      data: await this.signInGoogleService.signIn(payload),
    };
  }

  @Post('/facebook')
  @IsPublicEndpoint()
  private async signInWithFacebook(@Body() payload: SignInWithFacebookDto) {
    return {
      type: 'sigInWithFacebook',
      data: await this.signInFacebookService.signIn(payload),
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
      data: await this.signInPhoneNumberWithPasswordService.signIn(
        signInWithPhoneNumberAndPasswordDto,
      ),
    };
  }
}
