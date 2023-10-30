import { Inject, Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { MODULE_INSTANCES } from '../constants';

@Injectable()
export class GoogleOAuthService {
  constructor(
    @Inject(MODULE_INSTANCES.GOOGLE_OAUTH_CLIENT)
    public readonly oauthClient: OAuth2Client,
  ) {}

  private readonly logger = new Logger(GoogleOAuthService.name);
}
