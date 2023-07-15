import { SetMetadata } from '@nestjs/common';

import { AppConfig } from '../../app.config';
import { UserRole } from '../constants/enums';

export const RequireRoles = (roles: UserRole[]) =>
  SetMetadata(AppConfig.USER_ROLES_KEY, roles);
