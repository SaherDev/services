import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify, { FastifyInstance } from 'fastify';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { getLogLevels } from '@services/common';
import multiPart from '@fastify/multipart';

export async function createInstance() {
  const instance: FastifyInstance = fastify();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance)
  );

  const config = new DocumentBuilder()
    .setTitle('files-service')
    .setDescription('files service for files upload')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);

  app.useLogger(
    getLogLevels(configService.get<string>('environment.type') === 'prod')
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        configService.get<string>('environment.type') === 'prod',
      enableDebugMessages:
        configService.get<string>('environment.type') !== 'prod',
    })
  );

  await app.register(multiPart, {
    limits: {
      fileSize: configService.get<number>(
        'environment.storage.file.uploadFileLimit'
      ),
    },
  });
  return { instance, app, configService };
}
