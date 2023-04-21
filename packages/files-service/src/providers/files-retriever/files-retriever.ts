import { ConfigService } from '@nestjs/config';
import { IFilesRetriever } from './files-retriever.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IStorage, STORAGE } from '@services/utilities-storage';
import * as fs from 'fs';
@Injectable()
export class FilesRetriever implements IFilesRetriever {
  private ready: boolean;
  private bucket: string;
  constructor(
    @Inject(STORAGE) private readonly storageUtil: IStorage,
    private readonly configServe: ConfigService
  ) {
    this.initializeStorage();
    this.bucket = this.configServe.get<string>(
      'environment.storage.googleDrive.bucket'
    );
  }

  get(key: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(key);
    });
  }
  async set(Key: string, body: string): Promise<void> {
    let response: any;
    try {
      const file: Buffer = await fs.readFileSync(
        '/Users/saherheib/dev/repos/services/packages/files-service/src/providers/files-retriever/test.png'
      );
      response = await this.storageUtil.putObject(
        this.bucket,
        'test.png',
        file
      );
    } catch (error) {
      response = null;
    }

    return response;
  }

  private initializeStorage() {
    let response: any;
    try {
      response = this.storageUtil.initialize<any>(
        this.configServe.get<string>('environment.storage.googleDrive.region'),
        this.configServe.get<string>('environment.storage.googleDrive.profile'),
        this.configServe.get<string>(
          'environment.storage.googleDrive.credentialsPath'
        )
      );
    } catch (error) {
      response = null;
    }

    if (!response) {
      this.ready = false;
    }
  }
}
