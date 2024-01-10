import { Global, Module } from '@nestjs/common';

import { CoinAttendancesUtil } from './coin-attendances.util';
import { MatchesUtil } from './matches.util';
import {
  PaginationCursorDateUtil,
  PaginationCursorNumberUtil,
  PaginationCursorObjectIdUtil,
  PaginationCursorStringUtil,
} from './paginations';
import { ProfilesUtil } from './profiles.util';
import { UsersUtil } from './users.util';

@Global()
@Module({
  imports: [],
  exports: [
    ProfilesUtil,
    PaginationCursorStringUtil,
    PaginationCursorDateUtil,
    PaginationCursorObjectIdUtil,
    PaginationCursorNumberUtil,
    UsersUtil,
    MatchesUtil,
    CoinAttendancesUtil,
  ],
  controllers: [],
  providers: [
    ProfilesUtil,
    PaginationCursorStringUtil,
    PaginationCursorDateUtil,
    PaginationCursorObjectIdUtil,
    PaginationCursorNumberUtil,
    UsersUtil,
    MatchesUtil,
    CoinAttendancesUtil,
  ],
})
export class UtilsModule {}
