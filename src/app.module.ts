import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Joi from 'joi';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { JoiPipeModule } from 'nestjs-joi';
import path from 'path';
import winston from 'winston';

import { AppConfig } from './app.config';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { EncryptionsModule } from './modules/encryptions/encryptions.module';
import { JwtAuthGuard } from './modules/guards/jwt.guard';
import { RolesGuard } from './modules/guards/roles.guard';
import { HealthModule } from './modules/health/health.module';
import { LoggedDevicesModule } from './modules/logged-devices/logged-devices.module';
import { MediaFilesModule } from './modules/media-files/media-files.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ModelsModule } from './modules/models/models.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: Joi.object({
        // Node env
        NODE_ENV: Joi.string().required(),
        // App
        API_PORT: Joi.number().required(),
        //  Database
        MONGO_DB_HOST: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
        MONGO_DB_PORT: Joi.string().required(),
        MONGO_DB_USER: Joi.string().required(),
        MONGO_DB_PASS: Joi.string().required(),
        // Cache
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        // Firebase
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        // AWS
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        // Auth
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        HASH_SECRET_KEY: Joi.string().required(),
        // Country states city
        COUNTRY_STATE_CITY_API_KEY: Joi.string().required(),
        // Github
        GITHUB_WEBHOOK_SECRET_KEY: Joi.string().optional(),
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'info.log',
          level: 'info',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'warning.log',
          level: 'warning',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
          dirname: path.join(__dirname, './../log/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        // other transports...
      ],
      // other options
    }),
    ThrottlerModule.forRoot({ ttl: 10, limit: 100 }),
    MongooseModule.forRoot(
      `mongodb://117.2.240.66:10026/?authSource=admin&readPreference=primary&directConnection=true`,
      {
        dbName: process.env.MONGO_DB_NAME,
        user: process.env.MONGO_DB_USER,
        pass: process.env.MONGO_DB_PASS,
      },
    ),
    JoiPipeModule.forRoot(),
    ModelsModule,

    AuthModule,
    ProfileModule,
    UsersModule,
    ChatsModule,
    EncryptionsModule,
    RelationshipsModule,
    MessagesModule,
    MediaFilesModule,
    // CountriesModule,
    // StatesModule,
    LoggedDevicesModule,
    // ConversationsModule,
    HealthModule,
    // CoinsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
