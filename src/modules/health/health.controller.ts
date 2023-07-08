import { Body, Controller, Get, Logger, Post, Res } from '@nestjs/common';
import { execSync } from 'child_process';
import { Response } from 'express';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';

@Controller('health')
export class HealthController {
  private logger = new Logger(HealthController.name);
  @Post('/deploy')
  @IsPublicEndpoint()
  create(@Res() res: Response, @Body() body: unknown) {
    console.log(body);
    res.status(200).json({ success: true });

    try {
      execSync('git pull');
      execSync('yarn');
      execSync('yarn build');
      execSync('pm2 restart server');
    } catch (err) {
      this.logger.error(`Failed to deploy`, err);
    }
  }

  @IsPublicEndpoint()
  @Get()
  checkHealth() {
    return { health: 'ok' };
  }
}
