import { User } from './entities/user.entity';

export type FindOneUserConditions = {
  id?: string;
  phoneNumber?: string;
};

export type CurrentUser = User;
