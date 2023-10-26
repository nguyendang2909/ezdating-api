import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

import { MODULE_INSTANCES } from '../constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(MODULE_INSTANCES.REDIS) public readonly redis: Redis,
    @Inject(MODULE_INSTANCES.REDIS_LOCK)
    private readonly redlock: Redlock,
  ) {}
}
