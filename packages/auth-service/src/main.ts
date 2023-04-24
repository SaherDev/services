import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { getLogLevels } from '@services/common';
import secureSession from '@fastify/secure-session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = new DocumentBuilder()
    .setTitle('auth-service')
    .setDescription('auth service for user authentication')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);

  app.useLogger(
    getLogLevels(configService.get<string>('environment.type') === 'production')
  );

  await app.register(secureSession, {
    secret: configService.get<string>('common.auth.sessionWrapperSecret'),
    salt: configService.get<string>('common.auth.sessionWrapperSalt'),
    cookie: {
      maxAge: configService.get<string>('common.auth.sessionMaxAge'),
      path: '/',
      httpOnly: true,
      secure: configService.get<string>('environment.type') === 'production',
      sameSite: 'lax',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages:
        configService.get<string>('environment.type') === 'production',
      enableDebugMessages:
        configService.get<string>('environment.type') !== 'production',
    })
  );

  await app
    .listen(configService.get<number>('environment.port'), '0.0.0.0')
    .then(() => {
      console.log(
        `-------------- Started on port ${configService.get<number>(
          'environment.port'
        )} --------------`
      );
    });
}

bootstrap();
