import { StorageObjectType } from './storage-object-type';
import { StorageResponse } from './storage-response';

export interface IStorage {
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): StorageResponse<T>;

  putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    Object: Readonly<StorageObjectType>
  ): Promise<StorageResponse<T>>;

  getObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>
  ): Promise<StorageResponse<T>>;
}
