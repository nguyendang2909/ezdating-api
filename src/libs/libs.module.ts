import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';
import Redlock from 'redlock';

import { MODULE_INSTANCES } from '../constants';
import { FilesService } from './files.service';

@Global()
@Module({
  providers: [
    FilesService,
    {
      provide: MODULE_INSTANCES.REDIS,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('REDIS');
        const environmentOptions: RedisOptions = {};
        const optionsOverride = { ttl: 15 * 60 };
        const IOREDIS_MODE =
          configService.get<string>('IOREDIS_MODE') || 'standalone';
        const REDIS_HOST = configService.get<string>('REDIS_HOST');
        const REDIS_PORT = configService.get<string>('REDIS_PORT');
        // if (
        //   process.env.IOREDIS_MODE === 'sentinel' &&
        //   process.env.IOREDIS_SENTINEL_HOST
        // ) {
        //   environmentOptions.sentinels = [
        //     {
        //       host: process.env.IOREDIS_SENTINEL_HOST,
        //       port: process.env.IOREDIS_SENTINEL_PORT
        //         ? parseInt(process.env.IOREDIS_SENTINEL_PORT, 10)
        //         : 26379,
        //     },
        //   ];
        //   environmentOptions.name =
        //     process.env.IOREDIS_SENTINEL_NAME || 'mymaster';
        //   environmentOptions.sentinelPassword =
        //     process.env.IOREDIS_SENTINEL_PASSWORD;
        // }
        if (IOREDIS_MODE === 'standalone') {
          environmentOptions.host = REDIS_HOST;
          environmentOptions.port = REDIS_PORT
            ? parseInt(REDIS_PORT, 10)
            : 6379;
          // environmentOptions.db = process.env.IOREDIS_STANDALONE_DB
          //   ? parseInt(process.env.IOREDIS_STANDALONE_DB, 10)
          //   : 0;
          environmentOptions.password = process.env.IOREDIS_STANDALONE_PASSWORD;
        }
        const redis = new Redis({ ...environmentOptions, ...optionsOverride });
        redis.on('error', (err) => {
          logger.error(err, undefined, 'IORedis');
        });
        redis.on('connect', () => {
          logger.log('Connected to Redis', 'IORedis');
        });
        return redis;
      },
      inject: [ConfigService],
    },
    {
      provide: MODULE_INSTANCES.REDIS_LOCK,
      inject: [MODULE_INSTANCES.REDIS],
      useFactory: (redis: Redis) => {
        return new Redlock([redis]);
      },
    },
  ],
  exports: [FilesService],
})
export class LibsModule {}
