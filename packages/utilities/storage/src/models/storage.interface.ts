import { IStorageResponse } from './storage-response.interface';
import { StorageObjectType } from './storage-object-type';

export interface IStorage {
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): IStorageResponse<T>;

  putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    Object: Readonly<StorageObjectType>
  ): Promise<IStorageResponse<T>>;

  getObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>
  ): Promise<IStorageResponse<T>>;
}
