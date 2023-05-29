export interface IBufferProcessor {
  toRows(
    buffer: any,
    options: Record<string, any>
  ): AsyncGenerator<any, void, void>;
}
