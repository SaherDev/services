import { StorageCommand } from './storage-command.enum';

export interface IStoragePresigner {
  getSignedUrl(
    bucketName: Readonly<string>,
    key: Readonly<string>,
    command: Readonly<StorageCommand>,
    expiresIn?: Readonly<number>
  ): Promise<string>;
}
