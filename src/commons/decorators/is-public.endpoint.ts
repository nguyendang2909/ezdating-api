import { SetMetadata } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';

export const IsPublicEndpoint = () =>
  SetMetadata(APP_CONFIG.PUBLIC_ENDPOINT_METADATA, true);
