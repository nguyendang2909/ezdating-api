import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthService } from './auth.service';
import { RenewAccessTokenDto } from './dto/renew-access-token.dto';

@Controller('/auth')
@ApiTags('/auth')
@ApiBearerAuth('JWT')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refresh/access-token')
  @IsPublicEndpoint()
  public async renewAccessToken(@Body() payload: RenewAccessTokenDto) {
    return {
      type: 'tokens',
      data: await this.authService.renewAccessToken(payload),
    };
  }
}
