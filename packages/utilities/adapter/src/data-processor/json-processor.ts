import { IAdapterParserConfig, IBufferProcessor } from '@/models';

import { ObjectFieldsAccessor } from '@services/common-helpers';

export class JsonProcessor implements IBufferProcessor {
  async *toRowsAsync(
    buffer: any,
    config: IAdapterParserConfig
  ): AsyncGenerator<any, void, void> {
    let data =
      ObjectFieldsAccessor.getValues(buffer, [config?.dataPath])[0] ?? buffer;

    data = Array.isArray(data) ? data : [data];

    for (const x of data) {
      yield x;
    }
  }
}
