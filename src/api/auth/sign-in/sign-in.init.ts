import { Injectable, Logger } from '@nestjs/common';

import { USER_ROLES } from '../../../constants';
import { PasswordsService } from '../../../libs';
import { UserModel } from '../../models/user.model';

@Injectable()
export class SignInInitService {
  constructor(
    private readonly userModel: UserModel,
    private readonly passwordsService: PasswordsService,
  ) {}

  protected readonly logger = new Logger(SignInInitService.name);

  public async onApplicationBootstrap() {
    try {
      const phoneNumber = '+84971016191';
      const existAdminUser = await this.userModel.findOne({
        phoneNumber,
      });
      if (!existAdminUser && process.env.ADMIN_PASSWORD) {
        await this.userModel.createOne({
          phoneNumber,
          password: this.passwordsService.hash(process.env.ADMIN_PASSWORD),
          role: USER_ROLES.ADMIN,
        });
      }
    } catch (err) {
      this.logger.log(JSON.stringify(err));
    }
  }
}
