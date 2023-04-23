import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IFilesRetriever, FILES_RETRIEVER } from '@/providers';

@Injectable()
export class FileUploadService {
  private logger = new Logger(FileUploadService.name);
  constructor(
    @Inject(FILES_RETRIEVER) private readonly filesRetriever: IFilesRetriever
  ) {}

  async getFile(key: Readonly<string>): Promise<any> {
    let getFileResponse;
    let error: any = null;
    try {
      getFileResponse = await this.filesRetriever.get(key);
    } catch (err) {
      getFileResponse = null;
      error = err;
    }

    if (!getFileResponse || error) {
      this.logger.error(
        `getFile >> failed to retrieve file, aborting >> error = ${JSON.stringify(
          error
        )}`
      );
      throw new InternalServerErrorException('Get File Failed');
    }

    return getFileResponse;
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

    return uploadFileResponse;
  }
}
