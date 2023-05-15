import * as path from 'path';
import { ENV_CONFIG_FILE_PATH } from '@/config';
import { Inject } from '@nestjs/common';
import { FUNCTION, IFunction } from '@services/utilities-functions';
import { ConfigService } from '@nestjs/config';
import { IThumbnailsGenerator } from './thumbnails-generator.interface';
export class ThumbnailsGenerator implements IThumbnailsGenerator {
  constructor(
    @Inject(FUNCTION) private readonly functionUtil: IFunction,
    private readonly configServe: ConfigService
  ) {
    this.initializeFunction();
  }

  async create(id: Readonly<string>): Promise<any> {
    let response: Uint8Array;

    response = await this.functionUtil.invokeFunction<Uint8Array>(
      this.configServe.get<string>(`environment.functions.lambda.functionName`),
      this.configServe.get<string>(
        `environment.functions.lambda.invocationType`
      ),
      { id }
    );
    return this.prepareResponse(response);
  }

  private prepareResponse(functionResponse: Readonly<Uint8Array>): any {
    return JSON.parse(new TextDecoder('utf-8').decode(functionResponse));
  }

  private initializeFunction() {
    this.functionUtil.initialize<any>(
      this.configServe.get<string>(`environment.functions.lambda.region`),
      this.configServe.get<string>(`environment.functions.lambda.profile`),
      this.calculateCredentialsPath(
        this.configServe.get<string>(
          `environment.functions.lambda.credentialsPath`
        )
      )
    );
  }

  private calculateCredentialsPath = (filePath: string) => {
    return path.join(path.dirname(ENV_CONFIG_FILE_PATH), filePath);
  };
}
