import { IBufferProcessor } from '@services/models';

export class JsonProcessor implements IBufferProcessor {
  async *toRows(
    buffer: any,
    options: Record<string, any> = {}
  ): AsyncGenerator<any, void, void> {
    for await (const x of buffer) {
      yield x;
    }
  }
}
