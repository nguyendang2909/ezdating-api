import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRoles } from '../../../commons/constants';
import { RequireRoles } from '../../../commons/decorators/require-roles.decorator';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto';

@Controller('/admin/auth')
@ApiTags('/auth/sign-in')
@ApiBearerAuth('JWT')
@RequireRoles([UserRoles.admin])
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
