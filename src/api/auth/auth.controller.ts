import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { AuthService } from './auth.service';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('/auth')
@ApiTags('/auth')
@ApiBearerAuth('JWT')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logout')
  @IsPublicEndpoint()
  public async logout(@Body() payload: LogoutDto) {
    const success = await this.authService.logout(payload);
    return {
      type: 'logout',
      success,
    };
  }

  @Post('/tokens/access-token')
  @IsPublicEndpoint()
  public async refreshAccessToken(@Body() payload: RefreshTokenDto) {
    try {
      return {
        type: 'accessToken',
        data: await this.authService.refreshAccessToken(payload),
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Post('/tokens/refresh-token')
  @IsPublicEndpoint()
  public async refreshToken(@Body() payload: RefreshTokenDto) {
    try {
      return {
        type: 'refreshToken',
        data: await this.authService.refreshToken(payload),
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
