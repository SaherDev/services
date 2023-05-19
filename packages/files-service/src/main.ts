import { createInstance } from './app';

async function bootstrap() {
  const { app, configService } = await createInstance();

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
