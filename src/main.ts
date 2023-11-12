import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { CustomReturnFieldsInterceptor } from './middlewares/custom-return-fields.interceptor';
import { HttpExceptionFilter } from './middlewares/https-exception.filter';

const logger = new Logger('Main');

const NODE_ENV = process.env.NODE_ENV;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    ...(NODE_ENV === 'development'
      ? {
          httpsOptions: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem'),
          },
        }
      : {}),
    logger:
      NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  const API_PORT = process.env.API_PORT;
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new CustomReturnFieldsInterceptor());
  if (NODE_ENV === 'development' || NODE_ENV === 'staging') {
    createSwagger(app);
  }
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(API_PORT);
  mongoose.set('debug', (collectionName, method, query, doc) => {
    logger.log(
      `${collectionName}.${method} , ${JSON.stringify(query)}, ${JSON.stringify(
        doc,
      )}`,
    );
  });
}

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('vMessage')
    .setDescription('Chat application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addServer('/', 'Server')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();

process.on('unhandledRejection', (error, cb) => {
  logger.error(error);
});
