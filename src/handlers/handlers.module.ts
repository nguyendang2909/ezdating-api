import { Global, Module } from '@nestjs/common';

import { MatchesSocketEventHandler } from './events';
import { LikesHandler } from './likes.handler';
import { MatchesHandler } from './matches.handler';

@Global()
@Module({
  imports: [],
  exports: [MatchesHandler, MatchesSocketEventHandler, LikesHandler],
  controllers: [],
  providers: [MatchesHandler, MatchesSocketEventHandler, LikesHandler],
})
export class HandlersModule {}
