import { DataSourceType, IBufferProcessor } from '../models';

import { ExcelProcessor } from './excel-processor';
import { JsonProcessor } from './json-processor';

export class DataProcessorFactory {
  private static readonly _dataProcessors: Map<string, IBufferProcessor> =
    new Map<string, IBufferProcessor>();

  private static init(): void {
    this._dataProcessors[DataSourceType.json] = new JsonProcessor();
    this._dataProcessors[DataSourceType.Excel] = new ExcelProcessor();
  }

  static getProcessor(type: DataSourceType): IBufferProcessor {
    if (!this._dataProcessors.size) {
      this.init();
    }

    if (!this._dataProcessors[type]) {
      throw new Error(
        `getProcessor >> Data processor for ${type} is not defined`
      );
    }

    return this._dataProcessors[type];
  }
}
