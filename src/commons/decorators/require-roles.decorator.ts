import { SetMetadata } from '@nestjs/common';

import { AppConfig } from '../../app.config';
import { UserRole } from '../constants';

export const RequireRoles = (roles: UserRole[]) =>
  SetMetadata(AppConfig.USER_ROLES_KEY, roles);
