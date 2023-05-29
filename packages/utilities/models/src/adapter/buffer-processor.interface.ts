export interface IBufferProcessor {
  toRowsAsync(
    buffer: any,
    options: Record<string, any>
  ): AsyncGenerator<any, void, void>;
}
