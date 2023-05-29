import { DataSourceType, IBufferProcessor } from '@services/models';

import { JsonProcessor } from './json-processor';

export class DataProcessorFactory {
  private static readonly _dataProcessors: Map<string, IBufferProcessor> =
    new Map<string, IBufferProcessor>();

  constructor() {
    DataProcessorFactory.init();
  }

  private static init(): void {
    DataProcessorFactory._dataProcessors[DataSourceType.json] =
      new JsonProcessor();
  }

  static getProcessor(type: DataSourceType): IBufferProcessor {
    if (!DataProcessorFactory._dataProcessors[type]) {
      throw new Error(
        `getProcessor >> Data processor for ${type} is not defined`
      );
    }

    return DataProcessorFactory._dataProcessors[type];
  }
}
