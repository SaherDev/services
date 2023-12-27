import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance, fastify } from 'fastify';
import { HttpExceptionFilter, getLogLevels } from '@services/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import secureSession from '@fastify/secure-session';

export async function createInstance() {
  const instance: FastifyInstance = fastify();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance)
  );

  const configService: ConfigService = app.get(ConfigService);
  // if (configService.get<string>('environment.type') !== 'dev') {
  //   const config = new DocumentBuilder()
  //     .setTitle('auth-service')
  //     .setDescription('library-service API description')
  //     .setVersion('1.0')
  //     .build();
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('api', app, document);
  // }

  app.useLogger(
    getLogLevels(configService.get<string>('environment.type') === 'prod')
  );

  await app.register(secureSession, {
    secret: configService.get<string>('common.auth.sessionWrapperSecret'),
    salt: configService.get<string>('common.auth.sessionWrapperSalt'),
    cookie: {
      maxAge: configService.get<number>('common.auth.sessionMaxAge'),
      path: '/',
      httpOnly: true,
      secure: configService.get<string>('environment.type') === 'prod',
      sameSite: 'lax',
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        configService.get<string>('environment.type') === 'prod',
      enableDebugMessages:
        configService.get<string>('environment.type') !== 'prod',
    })
  );

  return { instance, app, configService };
}
