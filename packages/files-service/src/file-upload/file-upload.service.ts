import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IFilesRetriever, FILES_RETRIEVER } from '@/providers';
import { IFormData } from '@services/common';
import { IAdapterSchema, Adapter } from '@services/adapter';
import { StreamProcessor } from '@services/common-helpers';
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

  async uploadFile(form: IFormData): Promise<string> {
    if (!form.files || !form.files.length) {
      this.logger.error(`uploadFile >>  field missing, aborting.`);
      throw new BadRequestException('files missing');
    }

    let uploadFileResponse;
    let error: any = null;
    try {
      uploadFileResponse = await this.filesRetriever.set(
        form.files[0].filename,
        await form.files[0].toBuffer()
      );
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

  async pullData(
    schemasLocationId: Readonly<string>,
    schemaName: Readonly<string>
  ) {
    let schema: IAdapterSchema;
    try {
      let schemas = await this.getFile(schemasLocationId);

      schemas = await StreamProcessor.readStreamAsJson(schemas);
      schema = schemas?.find((sc) => sc.name === schemaName);
      if (!schema) {
        throw new Error();
      }
    } catch (error) {
      this.logger.error(
        `pullData >> schema not found aborting, schemasLocationId = ${schemasLocationId}, schemaName = ${schemaName}`
      );

      throw new BadRequestException('Schema Not found');
    }

    let parsedDataGenerator: AsyncGenerator<any, void, void> = null;
    try {
      let pulledDat = await Adapter.pullData(schema.request);
      if (!pulledDat) {
        throw new Error();
      }

      parsedDataGenerator = Adapter.parseData(
        schema.dataType,
        pulledDat,
        schema.parser
      );

      if (!parsedDataGenerator) {
        throw new Error();
      }
    } catch (error) {
      this.logger.error(
        `pullData >> empty data, aborting, error = ${JSON.stringify(error)}`
      );
      throw new InternalServerErrorException('Parsing Failed');
    }

    return await Adapter.transformData(
      parsedDataGenerator,
      schema.transformers,
      schema.lookups
    );
  }
}
