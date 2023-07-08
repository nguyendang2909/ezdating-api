import { SetMetadata } from '@nestjs/common';

import { AppConfig } from '../../app.config';
import { UserRole } from '../../modules/users/users.constant';

export const RequireRoles = (roles: UserRole[]) =>
  SetMetadata(AppConfig.ROLES_KEY, roles);
