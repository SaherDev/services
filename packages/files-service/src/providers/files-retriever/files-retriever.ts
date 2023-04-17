import { IFilesRetriever } from './files-retriever.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IStorage, STORAGE } from '@services/utilities-storage';

@Injectable()
export class FilesRetriever implements IFilesRetriever {
  private readonly logger = new Logger(FilesRetriever.name);
  private ready: boolean;

  constructor(@Inject(STORAGE) private readonly storageUtil: IStorage) {
    this.initializeStorage();
  }

  get(key: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(key);
    });
  }
  set(Key: string, body: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private initializeStorage() {
    let response: any;

    try {
      response = this.storageUtil.initialize<any>('dlldkld', 'dlkdkl', 'ldkld');
    } catch (error) {
      response = null;
    }

    if (!response) {
      this.ready = false;
    }
  }
}
