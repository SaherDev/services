import {
  DataSourceType,
  IAdapterDictionaryConfig,
  IAdapterTransformerConfig,
  IBufferProcessor,
  ITransformError,
  ITransformResult,
} from '@services/models';

import { DataProcessorFactory } from './data-processor';
import { DataTransformer } from './data-transformer';

export class Adapter {
  static async pullData(): Promise<any> {
    return null;
  }

  static parseData(
    schemaDataType: DataSourceType,
    data: any,
    options: Record<string, any> = {}
  ): AsyncGenerator<any, void, void> {
    const processor: IBufferProcessor =
      DataProcessorFactory.getProcessor(schemaDataType);
    return processor.toRowsAsync(data, options);
  }

  static async transformData<T>(
    rowsDataAsync: AsyncGenerator<any, void, void>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig
  ): Promise<ITransformResult<T>> {
    return await DataTransformer.transform<T>(
      rowsDataAsync,
      transformers,
      lookups
    );
  }
}
