import { FileMemType, FolderMemType } from './mem-types';
import { IStorage, StorageObjectType } from '@/models';
import { drive_v3, google } from 'googleapis';

import { GaxiosResponse } from 'gaxios';
import { Readable } from 'stream';

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

    let [objectParentId, keySuffix]: [string, string] = ['', ''];
    let objectPathError: any = null;
    try {
      [objectParentId, keySuffix] =
        await this.createObjectPathAndGetObjectParentIdAndObjectSuffix(
          bucketName,
          key
        );
    } catch (error) {
      objectPathError = error;
      objectParentId = null;
    }

    if (!objectParentId || !keySuffix || objectPathError)
      throw new Error(
        `failed to create object path >> error = ${
          JSON.stringify(objectPathError) ?? objectPathError
        }`
      );

    let responseObject: GaxiosResponse<drive_v3.Schema$File> = null;
    let error: any = null;
    try {
      responseObject = await this.client.files.create(
        this.createPutParamsResource(objectParentId, keySuffix, object)
      );
    } catch (err: any) {
      error = err;
      responseObject = null;
    }

    if (!responseObject || error || !responseObject.data)
      throw new Error(
        `failed to putObject >> error = ${JSON.stringify(error)}`
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

    let responseObject: GaxiosResponse<drive_v3.Schema$File> = null;
    let error: any = null;
    try {
      responseObject = await this.client.files.get(
        {
          fileId: key,
          alt: 'media',
        },
        { responseType: 'arraybuffer' }
      );
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

  private createPutParamsResource(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    object: Readonly<StorageObjectType> | undefined = undefined
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
        body: this.bufferToStream(object as Buffer),
        mimeType: 'application/octet-stream',
      };
    } else {
      paramsResource.requestBody.mimeType = FolderMemType;
    }

    return paramsResource;
  }

  private bufferToStream(buffer: Buffer): Readable {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  private async createObjectPathAndGetObjectParentIdAndObjectSuffix(
    bucket: Readonly<string>,
    key: Readonly<string>
  ): Promise<[string, string]> {
    const pathParts: string[] = key.split('/');
    if (pathParts.length < 1) return [bucket, key];

    let currentParentId = bucket;

    for (const part of pathParts.slice(0, -1)) {
      const existingFolderId: string = await this.findFolderByName(
        currentParentId,
        part
      );

      if (existingFolderId) {
        currentParentId = existingFolderId;
      } else {
        const createdFolderId: string = await this.createFolder(
          currentParentId,
          part
        );
        currentParentId = createdFolderId;
      }
    }

    return [currentParentId, pathParts[pathParts.length - 1]];
  }

  private async createFolder(
    parentFolderId: string,
    folderName: string
  ): Promise<string> {
    const response = await this.client.files.create(
      this.createPutParamsResource(parentFolderId, folderName)
    );

    return response.data.id;
  }

  private async findFolderByName(
    parentFolderId: string,
    folderName: string
  ): Promise<string | null> {
    const response = await this.client.files.list({
      q: `mimeType='${FolderMemType}' and trashed = false and name = '${folderName}' and '${parentFolderId}' in parents`,
      fields: 'nextPageToken, files(id, name)',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    return null;
  }

  private async streamBuffer(stream): Promise<Buffer> {
    return Buffer.from(stream);
  }
}
