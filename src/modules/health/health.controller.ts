import { Controller, Get, Post } from '@nestjs/common';
import { execSync } from 'child_process';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { RequireRoles } from '../../commons/decorators/require-roles.decorator';
import { UserRoles } from '../users/users.constant';

@Controller('health')
export class HealthController {
  @Post('/deploy')
  @RequireRoles([UserRoles.admin])
  create() {
    execSync('git pull');
    execSync('yarn');
    execSync('yarn build');
    execSync('pm2 restart server');

    return { health: 'ok' };
  }

  @IsPublicEndpoint()
  @Get()
  checkHealth() {
    return { health: 'ok' };
  }
}
