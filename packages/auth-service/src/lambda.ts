import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { FastifyInstance } from 'fastify';
import { createInstance } from './app';
import { proxy } from 'aws-serverless-fastify';

let appInstance: FastifyInstance;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!appInstance) {
    const { instance, app } = await createInstance();
    await app.init();
    appInstance = instance;
  }
  return await proxy(appInstance, event, context);
};
