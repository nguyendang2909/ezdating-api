import dotenv from 'dotenv';

dotenv.config({
  path: `/.env.${process.env.NODE_ENV}`,
});

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { CustomReturnFieldsInterceptor } from './middlewares/custom-return-fields.interceptor';
import { HttpExceptionFilter } from './middlewares/https-exception.filter';

const logger = new Logger('Main');

const NODE_ENV = process.env.NODE_ENV;

async function bootstrap() {
  const app =
    NODE_ENV === 'development'
      ? await NestFactory.create(AppModule, {
          httpsOptions: {
            key: fs.readFileSync('./.cert/key.pem'),
            cert: fs.readFileSync('./.cert/cert.pem'),
          },
        })
      : await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const API_PORT = configService.get<string>('API_PORT') || 4000;
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
  logger.log(`Application running on port ${API_PORT}`);
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
