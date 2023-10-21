import { SetMetadata } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { UserRole } from '../constants';

export const RequireRoles = (roles: UserRole[]) => {
  return SetMetadata(APP_CONFIG.USER_ROLES_KEY, roles);
};
