import { Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { Request, Response } from 'express';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';

@Controller('health')
export class HealthController {
  private logger = new Logger(HealthController.name);

  private readonly GITHUB_WEBHOOK_SECRET_KEY =
    process.env.GITHUB_WEBHOOK_SECRET_KEY;

  @Post('/deploy/develop')
  @IsPublicEndpoint()
  deployDevelop(@Res() res: Response, @Req() req: Request) {
    if (this.GITHUB_WEBHOOK_SECRET_KEY) {
      const signature = crypto
        .createHmac('sha256', this.GITHUB_WEBHOOK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');
      if (
        `sha256=${signature}` === req.headers['x-hub-signature-256'] &&
        req.body.ref === 'refs/heads/develop'
      ) {
        res.status(200).json({ sucess: true });
        try {
          execSync('git pull');
          execSync('yarn');
          execSync('yarn build');
          execSync('git checkout yarn.lock');
          execSync('pm2 restart server');
        } catch (err) {
          this.logger.error(`Failed to deploy`, err);
        }
        return;
      }
    }

    return res.status(200).json({ success: false });
  }

  @IsPublicEndpoint()
  @Get()
  checkHealth() {
    return { health: 'ok' };
  }
}
