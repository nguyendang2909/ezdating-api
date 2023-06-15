import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { JoiPipeModule } from 'nestjs-joi';
import path from 'path';
import winston from 'winston';

import { AppConfig } from './app.config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { EncryptionsModule } from './modules/encryptions/encryptions.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UsersModule } from './modules/users/users.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: Number(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development' ? true : false,
    }),
    JoiPipeModule.forRoot(),
    AuthModule,
    UsersModule,
    ChatsModule,
    RoomsModule,
    ContactsModule,
    EncryptionsModule,
    RelationshipsModule,
    MessagesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
