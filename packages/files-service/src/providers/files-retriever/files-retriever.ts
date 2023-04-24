import { fileUuid } from './../../../../common/src/providers/uuid/file-uuid';
import { ConfigService } from '@nestjs/config';
import { IFilesRetriever } from './files-retriever.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IStorage, STORAGE } from '@services/utilities-storage';
import * as fs from 'fs';
import * as path from 'path';
import { ENV_CONFIG_FILE_PATH } from '@/config';

@Injectable()
export class FilesRetriever implements IFilesRetriever {
  private bucket: string;
  private storageProvider = '';
  constructor(
    @Inject(STORAGE) private readonly storageUtil: IStorage,
    private readonly configServe: ConfigService
  ) {
    // this.storageProvider = "googleDrive";
    this.storageProvider = 's3';

    this.initializeStorage();

    this.bucket = this.configServe.get<string>(
      `environment.storage.${this.storageProvider}.bucket`
    );
  }

  async get(key: string): Promise<any> {
    return await this.storageUtil.getObject(this.bucket, key);
  }

  async set(Key: string, buffer: Buffer): Promise<string> {
    let fileId = fileUuid(Key);
    await this.storageUtil.putObject(this.bucket, fileId, buffer);
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

  private readTestFile = (): Buffer => {
    //XXX:FILE PATH HERE
    return fs.readFileSync('test.png');
  };
}
