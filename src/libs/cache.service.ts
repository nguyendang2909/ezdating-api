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

  async setex(key: string, ttl: number, value: Record<string, any>) {
    return this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
}
