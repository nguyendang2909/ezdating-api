import { Logger } from '@nestjs/common';
import { PasswordsService } from '../../../libs';
import { UserModel } from '../../models/user.model';
export declare class SignInInitService {
    private readonly userModel;
    private readonly passwordsService;
    constructor(userModel: UserModel, passwordsService: PasswordsService);
    protected readonly logger: Logger;
    onApplicationBootstrap(): Promise<void>;
}
