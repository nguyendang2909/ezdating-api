import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequireRoles } from '../../../commons/decorators/require-roles.decorator';
import { USER_ROLES } from '../../../constants';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto';

@Controller('/admin/auth')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
@RequireRoles([USER_ROLES.ADMIN])
export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  @Post('/login')
  private async signInWithPhoneNumber(@Body() payload: AdminLoginDto) {
    return {
      type: 'adminLogin',
      data: await this.service.login(payload),
    };
  }
}
