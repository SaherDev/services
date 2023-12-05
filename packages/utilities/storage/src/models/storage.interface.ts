import { StorageObjectType } from './storage-object-type';

export interface IStorage {
  initialize<T>(
    region: Readonly<string>,
    profile: Readonly<string>,
    credentialsPath: Readonly<string>
  ): T;

  putObject<T>(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    Object: Readonly<StorageObjectType>
  ): Promise<T>;

  getObject<T>(bucketName: Readonly<string>, key: Readonly<string>): Promise<T>;
}
