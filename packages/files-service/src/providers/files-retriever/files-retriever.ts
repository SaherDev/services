import { fileUuid } from '@services/common';
import { ConfigService } from '@nestjs/config';
import { IFilesRetriever } from './files-retriever.interface';
import { Inject, Injectable } from '@nestjs/common';
import {
  IStorage,
  IStoragePresigner,
  STORAGE,
  StorageCommand,
  STORAGE_PRESIGNER,
} from '@services/utilities-storage';
import * as path from 'path';
import { ENV_CONFIG_FILE_PATH } from '@/config';

@Injectable()
export class FilesRetriever implements IFilesRetriever {
  private bucket: string;
  private storageProvider = '';
  constructor(
    @Inject(STORAGE) private readonly storageUtil: IStorage,
    @Inject(STORAGE_PRESIGNER)
    private readonly storagePresignerUtil: IStoragePresigner,
    private readonly configServe: ConfigService
  ) {
    // this.storageProvider = "googleDrive";
    this.storageProvider = 's3';

    this.initializeStorage();

    this.bucket = this.configServe.get<string>(
      `environment.storage.${this.storageProvider}.bucket`
    );
  }

  async getSignedUrl(key: string): Promise<string> {
    return await this.storagePresignerUtil.getSignedUrl(
      this.bucket,
      key,
      StorageCommand.Get
    );
  }

  async get(key: string): Promise<any> {
    return await this.storageUtil.getObject(this.bucket, key);
  }

  async set(Key: string, buffer: Buffer): Promise<string> {
    let fileId = fileUuid(Key);
    const rsponse = await this.storageUtil.putObject(
      this.bucket,
      fileId,
      buffer
    );

    return fileId;
  }

  private initializeStorage() {
    this.storageUtil.initialize<any>(
      this.configServe.get<string>(
        `environment.storage.${this.storageProvider}.region`
      ),
      this.configServe.get<string>(
        `environment.storage.${this.storageProvider}.profile`
      ),
      this.calculateCredentialsPath(
        this.configServe.get<string>(
          `environment.storage.${this.storageProvider}.credentialsPath`
        )
      )
    );
  }

  private calculateCredentialsPath = (filePath: string) => {
    return path.join(path.dirname(ENV_CONFIG_FILE_PATH), filePath);
  };
}
