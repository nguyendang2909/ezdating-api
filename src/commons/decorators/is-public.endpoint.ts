import { SetMetadata } from '@nestjs/common';

import { AppConfig } from '../../app.config';

export const IsPublicEndpoint = () =>
  SetMetadata(AppConfig.PUBLIC_ENDPOINT_METADATA, true);
