import { Global, Logger, Module } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';
import { Redis, RedisOptions } from 'ioredis';
import Redlock from 'redlock';

import { MODULE_INSTANCES } from '../constants';
import { CacheService } from './cache.service';
import { FilesService } from './files.service';
import { FirebaseService } from './firebase.service';
import { GoogleOAuthService } from './google-oauth.service';

@Global()
@Module({
  providers: [
    FilesService,
    {
      provide: MODULE_INSTANCES.REDIS,
      useFactory: () => {
        const logger = new Logger('REDIS');
        const environmentOptions: RedisOptions = {};
        const optionsOverride = { ttl: 15 * 60 };
        const IOREDIS_MODE = process.env.IOREDIS_MODE || 'standalone';

        const REDIS_HOST = process.env.REDIS_HOST;
        const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;
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
          environmentOptions.port = REDIS_PORT;
          // environmentOptions.db = process.env.IOREDIS_STANDALONE_DB
          //   ? parseInt(process.env.IOREDIS_STANDALONE_DB, 10)
          //   : 0;
          environmentOptions.password = process.env.IOREDIS_STANDALONE_PASSWORD;
        }
        // const redis = new Redis({ ...environmentOptions, ...optionsOverride });
        const redis = new Redis(
          `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        );
        redis.on('error', (err) => {
          logger.error(err, 'IORedis');
        });
        redis.on('connect', () => {
          logger.log('Connected to Redis', 'IORedis');
        });
        return redis;
      },
    },
    {
      provide: MODULE_INSTANCES.REDIS_LOCK,
      inject: [MODULE_INSTANCES.REDIS],
      useFactory: (redis: Redis) => {
        return new Redlock([redis], {
          driftFactor: 0.01,
          retryCount: 10,
          retryDelay: 200,
          retryJitter: 200,
          automaticExtensionThreshold: 500,
        });
      },
    },
    {
      provide: MODULE_INSTANCES.FIREBASE,
      useFactory: () => {
        return firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
          }),
        });
      },
    },
    {
      provide: MODULE_INSTANCES.GOOGLE_OAUTH_CLIENT,
      useFactory: () => {
        return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      },
    },
    CacheService,
    FirebaseService,
    GoogleOAuthService,
  ],
  exports: [FilesService, CacheService, FirebaseService, GoogleOAuthService],
})
export class LibsModule {}
