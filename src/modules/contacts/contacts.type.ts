import { EContactStatus } from './contacts.constant';

export interface ICanSetContactStatus {
  status: EContactStatus;
  currentStatus: EContactStatus;
  isRequesterMe: boolean;
}
