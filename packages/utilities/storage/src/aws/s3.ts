import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { IStorage, StorageObjectType } from '@/models';

import { fromIni } from '@aws-sdk/credential-providers';

export class S3 implements IStorage {
  private client: S3Client;
  private ready: boolean;

  constructor() {
    this.ready = false;
  }

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
      this.client = new S3Client({
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

  async putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    body: Readonly<StorageObjectType>
  ): Promise<T> {
    if (!this.ready) throw new Error('not ready');

    if (!bucketName || !key || !body)
      throw new Error(
        `fields are missing >>  bucketName = ${bucketName} , key = ${key} body = ${
          body ? body : '!body'
        }`
      );

    let responseObject: PutObjectCommandOutput = null;
    let error: any = null;
    try {
      responseObject = await this.client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: body,
        })
      );
    } catch (err: any) {
      error = err;

      throw new Error(
        `failed to put object >> bucketName = ${bucketName}, error = ${JSON.stringify(
          error
        )}`
      );
    }

    return responseObject as T;
  }

  async getObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>
  ): Promise<T> {
    if (!this.ready) throw new Error('not ready');

    if (!bucketName || !key)
      throw new Error(
        `fields are missing >>  bucketName = ${bucketName} , key = ${key}'}`
      );

    let responseObject: GetObjectCommandOutput = null;
    let error: any = null;
    try {
      responseObject = await this.client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );
    } catch (err: any) {
      error = err;
    }

    if (!responseObject || error) {
      throw new Error(
        `failed to get object >> bucketName = ${bucketName}, error = ${JSON.stringify(
          error
        )}`
      );
    }

    return responseObject.Body as any;
  }
}
