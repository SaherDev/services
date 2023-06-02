import { IAdapterParserConfig, IBufferProcessor } from '@services/models';

export class JsonProcessor implements IBufferProcessor {
  async *toRowsAsync(
    buffer: any,
    config: IAdapterParserConfig
  ): AsyncGenerator<any, void, void> {
    for (const x of buffer) {
      yield x;
    }
  }
}
