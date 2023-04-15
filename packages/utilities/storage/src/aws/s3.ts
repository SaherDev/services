import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { IStorage, StorageObjectType, StorageResponse } from '@/models';

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
  ): StorageResponse<T> {
    if (!region || !profile || !credentialsPath) {
      this.ready = false;

      return {
        success: false,
        errorMessage: `fields are missing >> region = ${region}, profile = ${profile},  credentialsPath = ${credentialsPath} `,
      };
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
    }

    if (!this.client) {
      this.ready = false;

      return {
        success: false,
        errorMessage: 'creating client failed',
      };
    }

    this.ready = true;

    return {
      success: true,
      returnObject: this.client as any,
    };
  }

  async putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    body: Readonly<StorageObjectType>
  ): Promise<StorageResponse<T>> {
    if (!this.ready) {
      return {
        success: false,
        errorMessage: 'not ready',
      };
    }

    if (!bucketName || !key || !body) {
      return {
        success: false,
        errorMessage: `fields are missing, bucketName = ${bucketName} , key = ${key} body = ${
          body ? body : '!body'
        }`,
      };
    }

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
    }

    if (!responseObject || error) {
      return {
        success: false,
        errorMessage: `failed to put object >> bucketName = ${bucketName}, error = ${JSON.stringify(
          error
        )}`,
      };
    }

    return {
      success: true,
      returnObject: responseObject as T,
    };
  }

  async getObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>
  ): Promise<StorageResponse<T>> {
    if (!this.ready) {
      return {
        success: false,
        errorMessage: 'not ready',
      };
    }

    if (!bucketName || !key) {
      return {
        success: false,
        errorMessage: `fields are missing, bucketName = ${bucketName} , key = ${key}'}`,
      };
    }

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
      return {
        success: false,
        errorMessage: `failed to put object >> bucketName = ${bucketName}, error = ${JSON.stringify(
          error
        )}`,
      };
    }

    return {
      success: true,
      returnObject: responseObject.Body as any,
    };
  }
}
