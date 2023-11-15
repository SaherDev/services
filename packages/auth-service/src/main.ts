import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { FastifyInstance } from 'fastify';
import { createInstance } from './app';
import fastifyAWSLambda from '@fastify/aws-lambda';

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

let cachedInstance: FastifyInstance;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!cachedInstance) {
    const { app, instance } = await createInstance();
    await app.init();
    cachedInstance = instance;
  }

  const proxy = fastifyAWSLambda(cachedInstance);
  return proxy(event, context);
};

bootstrap();
