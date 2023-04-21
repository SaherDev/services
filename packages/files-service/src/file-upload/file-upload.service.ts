import { FILES_RETRIEVER } from '@/config';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IFilesRetriever } from '../providers/files-retriever';

@Injectable()
export class FileUploadService {
  private logger = new Logger(FileUploadService.name);
  constructor(
    @Inject(FILES_RETRIEVER) private readonly filesRetriever: IFilesRetriever
  ) {}

  async getFile(key: Readonly<string>): Promise<string> {
    return this.filesRetriever.get(key);
  }

  async uploadFile(): Promise<void> {
    let uploadFileResponse;
    let error: any = null;
    try {
      uploadFileResponse = await this.filesRetriever.set('', '');
    } catch (err) {
      uploadFileResponse = null;
      error = err;
    }

    if (!uploadFileResponse || error) {
      this.logger.error(
        `uploadFile >> failed to upload file, aborting >> error = ${JSON.stringify(
          error
        )}`
      );
      throw new InternalServerErrorException('uploadFile Failed');
    }
  }
}
