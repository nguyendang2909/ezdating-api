import { Controller, Get, Post, Res } from '@nestjs/common';
import { execSync } from 'child_process';
import { Response } from 'express';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';

@Controller('health')
export class HealthController {
  @Post('/deploy')
  @IsPublicEndpoint()
  create(@Res() res: Response) {
    res.status(200);

    execSync('git pull');
    execSync('yarn');
    execSync('yarn build');
    execSync('pm2 restart server');
  }

  @IsPublicEndpoint()
  @Get()
  checkHealth() {
    return { health: 'ok' };
  }
}
