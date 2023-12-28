import { Global, Module } from '@nestjs/common';

import {
  PaginationCursorDateUtil,
  PaginationCursorNumberUtil,
  PaginationCursorObjectIdUtil,
  PaginationCursorStringUtil,
} from './paginations';
import { ProfilesUtil } from './profiles.util';

@Global()
@Module({
  imports: [],
  exports: [
    ProfilesUtil,
    PaginationCursorStringUtil,
    PaginationCursorDateUtil,
    PaginationCursorObjectIdUtil,
    PaginationCursorNumberUtil,
  ],
  controllers: [],
  providers: [
    ProfilesUtil,
    PaginationCursorStringUtil,
    PaginationCursorDateUtil,
    PaginationCursorObjectIdUtil,
    PaginationCursorNumberUtil,
  ],
})
export class UtilsModule {}
