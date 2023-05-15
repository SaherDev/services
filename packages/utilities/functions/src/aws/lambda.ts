import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
} from '@aws-sdk/client-lambda';

import { IFunction } from '@/models';
import { fromIni } from '@aws-sdk/credential-providers';

export class Lambda implements IFunction {
  private client: LambdaClient;
  private ready: boolean;
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): T {
    if (!region || !profile || !credentialsPath) {
      this.ready = false;
      throw new Error(
        `fields are missing >> region = ${region}, profile = ${profile},  credentialsPath = ${credentialsPath} `
      );
    }

    try {
      this.client = new LambdaClient({
        region: region,
        credentials: fromIni({
          profile: profile,
          filepath: credentialsPath,
        }),
      });
    } catch (err) {
      this.client = null;
      this.ready = false;
      throw new Error(
        `creating client failed >> error = ${JSON.stringify(err)}`
      );
    }
    this.ready = true;

    return this.client as T;
  }
  async invokeFunction<T>(
    name: Readonly<string>,
    type: Readonly<string>,
    payload: Readonly<any>
  ): Promise<T> {
    if (!this.ready) throw new Error('not ready');

    if (!name || !type || !payload)
      throw new Error(
        `fields are missing >>  name = ${name} , type = ${type} payload = ${
          payload ? JSON.stringify(payload) : '!body'
        }`
      );

    let responseObject: InvokeCommandOutput = null;
    let error: any = null;

    try {
      responseObject = await this.client.send(
        new InvokeCommand({
          FunctionName: name,
          InvocationType: type,
          Payload: new TextEncoder().encode(JSON.stringify({ body: payload })),
        })
      );
    } catch (err: any) {
      error = err;
    }

    if (!responseObject || error) {
      throw new Error(
        `failed to invoke Function >> name = ${name}, error = ${JSON.stringify(
          error
        )}`
      );
    }

    return responseObject.Payload as T;
  }
}
