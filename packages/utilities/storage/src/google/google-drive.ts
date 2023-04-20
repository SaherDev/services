import { IStorage, StorageObjectType } from '@/models';
import { drive_v3, google } from 'googleapis';

import { FolderMemType } from './mem-types';
import { GaxiosResponse } from 'gaxios';

export class GoogleDrive implements IStorage {
  private client: drive_v3.Drive;
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
      throw new Error(
        `fields are missing >> region = ${region}, profile = ${profile},  credentialsPath = ${credentialsPath} `
      );
    }

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: profile.split(','),
      });

      this.client = google.drive({ version: 'v3', auth });
    } catch (error) {
      this.client = null;
      this.ready = false;
      throw new Error(
        `creating client failed >> error = ${JSON.stringify(error)}`
      );
    }

    this.ready = true;
    return this.client as T;
  }
  async putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    object: Readonly<StorageObjectType>
  ): Promise<T> {
    if (!this.ready) throw new Error('not ready');
    if (!bucketName || !key)
      throw new Error(
        `fields are missing >>  bucketName = ${bucketName} , key = ${key}`
      );

    let responseObject: GaxiosResponse<drive_v3.Schema$File> = null;
    let error: any = null;
    try {
      responseObject = await this.client.files.create(
        this.createParamsResource(bucketName, key, object as Blob)
      );
    } catch (err: any) {
      error = err;
      responseObject = null;
    }
    if (!responseObject || error || !responseObject.data)
      throw new Error(
        `failed to delete messages >> error = ${JSON.stringify(error)}`
      );

    return responseObject.data as T;
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

    let responseObject: GaxiosResponse<drive_v3.Schema$FileList> = null;
    let error: any = null;
    try {
      responseObject = await this.client.files.list({
        q: `id = ${key}  and '${bucketName}' in parents`,
      });
    } catch (err: any) {
      error = err;
      responseObject = null;
    }

    if (!responseObject || error || !responseObject.data) {
      throw new Error(
        `failed to get object >> bucketName = ${bucketName}, error = ${JSON.stringify(
          error
        )}`
      );
    }
    return responseObject.data as T;
  }

  private createParamsResource(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    object?: Readonly<Blob>
  ): drive_v3.Params$Resource$Files$Create {
    const paramsResource: drive_v3.Params$Resource$Files$Create = {
      fields: 'id',
      requestBody: {
        name: key,
        parents: [bucketName],
        mimeType: undefined,
      },
      media: undefined,
    };

    if (object) {
      paramsResource.media = {
        body: object.stream(),
      };
    } else {
      paramsResource.requestBody.mimeType = FolderMemType;
    }

    return paramsResource;
  }
}
