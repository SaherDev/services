import {
  IAdapterDictionaryConfig,
  IAdapterTransformerConfig,
  ITransformError,
  ITransformResult,
  TransformResult,
} from '@services/models';

export class DataTransformer {
  static async transform<T>(
    rowsDataAsync: AsyncGenerator<any, void, void>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig
  ): Promise<ITransformResult<T>> {
    const result = new TransformResult<T>([], []);

    for await (const value of rowsDataAsync) {
      this.transformRowAndSetResult<T>(value, transformers, lookups, result);
    }
    return result;
  }

  private static transformRowAndSetResult<T>(
    row: Readonly<any>,
    transformers: IAdapterTransformerConfig[],
    lookups: IAdapterDictionaryConfig,
    result: ITransformResult<T>
  ): void {
    transformers.forEach((transformer) => {
      this.transformColumn<T>(row, transformer, lookups);
    });
  }

  private static transformColumn<T>(
    originalData: any,
    transformers: IAdapterTransformerConfig,
    lookups: IAdapterDictionaryConfig
  ): void {
    return null;
  }
  private static fromValues(
    originalData: any,
    accessKeys: Readonly<string[]>,
    defaultValue: Readonly<string>,
    lookups: IAdapterDictionaryConfig,
    accessFnc?: string
  ): any {}
  private static toTarget(target: Readonly<string>) {}
  private static validateResult(): boolean {
    return false;
  }

  private static generateFromFunction(
    accessKeys: Readonly<string[]>,
    defaultValue: Readonly<string>,
    lookups: IAdapterDictionaryConfig,
    accessFnc?: string
  ): Function {
    return null;
  }
}
