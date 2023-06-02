import { IAdapterParserConfig } from './adapter.parser.config.interface';

export interface IBufferProcessor {
  toRowsAsync(
    buffer: any,
    config: IAdapterParserConfig
  ): AsyncGenerator<any, void, void>;
}
