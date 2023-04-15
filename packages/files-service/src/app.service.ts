import { IFilesRetriever } from '@/providers';
import { Inject, Injectable } from '@nestjs/common';
import { FILES_RETRIEVER } from '@/config';

@Injectable()
export class AppService {
  constructor(
    @Inject(FILES_RETRIEVER) private readonly filesRetriever: IFilesRetriever
  ) {}

  getFile(key: Readonly<string>): Promise<string> {
    return this.filesRetriever.get(key);
  }
}
