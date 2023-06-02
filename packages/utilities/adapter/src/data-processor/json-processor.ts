import { IAdapterParserConfig, IBufferProcessor } from '@services/models';

import { ObjectFieldsAccessor } from '@services/common-helpers';

export class JsonProcessor implements IBufferProcessor {
  async *toRowsAsync(
    buffer: any,
    config: IAdapterParserConfig
  ): AsyncGenerator<any, void, void> {
    const data = config?.dataPath
      ? ObjectFieldsAccessor.getValues(buffer, [config?.dataPath])
      : buffer;

    for (const x of data) {
      yield x;
    }
  }
}
