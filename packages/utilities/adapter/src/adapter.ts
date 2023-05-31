import {
  DataSourceType,
  IAdapterLookupConfig,
  IAdapterRequestConfig,
  IAdapterTransformerConfig,
  IBufferProcessor,
  ITransformResult,
} from '@services/models';

import { DataProcessorFactory } from './data-processor';
import { DataRetriever } from './data-retriever';
import { DataTransformer } from './data-transformer';

export class Adapter {
  static async pullData(config: IAdapterRequestConfig): Promise<any> {
    return await DataRetriever.pullData(config);
  }

  static parseData(
    schemaDataType: DataSourceType,
    data: any,
    options: Record<string, any> = {}
  ): AsyncGenerator<any, void, void> {
    const processor: IBufferProcessor =
      DataProcessorFactory.getProcessor(schemaDataType);
    return processor.toRowsAsync(Array.isArray(data) ? data : [data], options);
  }

  static async transformData<T>(
    rowsDataAsync: AsyncGenerator<any, void, void>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterLookupConfig[]
  ): Promise<ITransformResult<T>> {
    return await DataTransformer.transform<T>(
      rowsDataAsync,
      transformers,
      lookups
    );
  }
}
